from __future__ import annotations

import os
import sys

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect

from app.live_runtime import LiveInterviewRuntime
from app.models import InterviewState

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from interaction_layer.communication.websocket_manager import WebSocketManager
from interaction_layer.config import InteractionConfig
from interaction_layer.error_handling.recovery import RecoveryManager
from interaction_layer.models import AudioChunk, BackendTurnResponse, TurnPayload
from interaction_layer.monitoring.presence import PresenceMonitor
from interaction_layer.persona.persona_engine import PersonaEngine
from interaction_layer.session.session_manager import InterviewSessionManager
from interaction_layer.turn.turn_manager import TurnManager
from interaction_layer.voice.stt import MockSTT
from interaction_layer.voice.tts import MockTTS

router = APIRouter()

_config = InteractionConfig()
_ws_manager = WebSocketManager()
_session_layer = InterviewSessionManager(_config)
_turn_manager = TurnManager(_config)
_stt = MockSTT()
_tts = MockTTS(_config)
_presence = PresenceMonitor(_config)
_persona = PersonaEngine()
_recovery = RecoveryManager()


async def _backend_process_turn(app, payload: TurnPayload) -> BackendTurnResponse:
    session_manager = app.state.session_manager
    runtime = getattr(app.state, "live_runtime", None)
    if runtime is None:
        runtime = LiveInterviewRuntime()
        app.state.live_runtime = runtime

    state = await session_manager.get_state(payload.session_id)
    if state is None:
        state = InterviewState(interview_id=payload.session_id)
        state = await runtime.bootstrap_question(state)
        await session_manager.set_state(state)

    message_id = f"interaction-{payload.turn_index}-{len(payload.transcript)}"
    answered_state = state.model_copy(
        update={"last_answer": payload.transcript, "last_message_id": message_id}
    )

    next_state = await runtime.process_answer(
        state=answered_state,
        answer=payload.transcript,
        message_id=message_id,
    )
    await session_manager.set_state(next_state)

    return BackendTurnResponse(response_text=next_state.last_question)


async def _stream_persona_audio(session_id: str, backend_text: str):
    async for token in _persona.stream_backend_response(backend_text):
        yield {"type": "persona_token", "content": token["token"], "is_final": token["is_final"]}

    async for audio_frame in _tts.text_to_speech(backend_text, session_id=session_id):
        yield {
            "type": "audio_frame",
            "index": audio_frame.index,
            "content": audio_frame.data,
            "is_final": audio_frame.is_final,
        }


@router.post("/process-turn", response_model=BackendTurnResponse)
async def process_turn(payload: TurnPayload, request: Request) -> BackendTurnResponse:
    return await _backend_process_turn(request.app, payload)


@router.websocket("/interaction/ws/{session_id}")
async def interaction_socket(websocket: WebSocket, session_id: str) -> None:
    await _ws_manager.connect(session_id=session_id, websocket=websocket)
    await _session_layer.start_session(session_id)
    await _turn_manager.start_turn(session_id=session_id, turn_index=1)

    try:
        session_manager = websocket.app.state.session_manager
        runtime = getattr(websocket.app.state, "live_runtime", None)
        if runtime is None:
            runtime = LiveInterviewRuntime()
            websocket.app.state.live_runtime = runtime

        state = await session_manager.get_state(session_id)
        if state is None:
            state = InterviewState(interview_id=session_id)
            state = await runtime.bootstrap_question(state)
            await session_manager.set_state(state)

        await _ws_manager.send_json(
            session_id,
            {
                "type": "backend_question",
                "turn": state.turn,
                "content": state.last_question,
            },
        )

        while True:
            payload = await websocket.receive_json()

            if payload.get("type") == "audio":
                chunk = AudioChunk(
                    session_id=session_id,
                    chunk_id=int(payload.get("chunk_id", 0)),
                    content=str(payload.get("content", "")),
                    is_final=bool(payload.get("is_final", False)),
                )
                event = await _stt.speech_to_text(chunk)
                await _session_layer.touch(session_id, voice_activity=bool(event.transcript))
                await _turn_manager.ingest_event(event)

                if event.interrupted:
                    await _ws_manager.send_json(
                        session_id,
                        {"type": "stt_interrupt", "detail": "stream interrupted"},
                    )
                    continue

                if event.transcript:
                    label = "final" if event.final else "partial"
                    await _ws_manager.send_json(
                        session_id,
                        {
                            "type": f"stt_{label}",
                            "transcript": event.transcript,
                            "confidence": event.confidence,
                        },
                    )

                if event.final and event.confidence < _config.stt_min_confidence:
                    action = await _recovery.on_low_confidence()
                    await _ws_manager.send_json(session_id, {"type": "recovery", **action.model_dump()})
                    continue

                completed = await _turn_manager.detect_completion(session_id)
                if not completed:
                    continue

                backend_response = await _turn_manager.submit_to_backend(
                    session_id=session_id,
                    backend_client=lambda turn_payload: _backend_process_turn(websocket.app, turn_payload),
                )

                async for frame in _stream_persona_audio(
                    session_id=session_id,
                    backend_text=backend_response.response_text,
                ):
                    await _ws_manager.send_json(session_id, frame)

                next_session = await _session_layer.increment_turn(session_id)
                if next_session is not None:
                    await _turn_manager.start_turn(
                        session_id=session_id,
                        turn_index=next_session.turn_index + 1,
                    )

            elif payload.get("type") == "stop":
                await _turn_manager.explicit_stop(session_id)
            elif payload.get("type") == "presence":
                snapshot = await _presence.snapshot(
                    camera_active=bool(payload.get("camera_active", True)),
                    tab_focused=bool(payload.get("tab_focused", True)),
                    response_latency_ms=int(payload.get("response_latency_ms", 0)),
                )
                await _ws_manager.send_json(session_id, {"type": "presence", **snapshot.model_dump()})
            elif payload.get("type") == "silence_check":
                is_silent = await _session_layer.detect_silence(session_id)
                if is_silent:
                    action = await _recovery.on_silence()
                    await _ws_manager.send_json(session_id, {"type": "recovery", **action.model_dump()})

            timed_out = await _session_layer.track_time(session_id)
            if timed_out:
                await _ws_manager.send_json(session_id, {"type": "session_timeout"})
                break

    except WebSocketDisconnect:
        pass
    finally:
        await _session_layer.end_session(session_id)
        await _ws_manager.disconnect(session_id=session_id, websocket=websocket)
