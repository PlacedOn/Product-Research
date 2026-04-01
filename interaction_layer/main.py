from __future__ import annotations

import asyncio
import os
import sys
from collections.abc import AsyncGenerator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

if __package__ in (None, ""):
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

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

app = FastAPI(title="Interaction & AI Persona Layer")

ws_manager = WebSocketManager()
session_manager = InterviewSessionManager(InteractionConfig())
turn_manager = TurnManager(InteractionConfig())
stt = MockSTT()
tts = MockTTS(InteractionConfig())
presence = PresenceMonitor(InteractionConfig())
persona = PersonaEngine()
recovery = RecoveryManager()


async def backend_process_turn(payload: TurnPayload) -> BackendTurnResponse:
    return BackendTurnResponse(
        response_text=(
            "Thanks for the explanation. Now please go deeper into trade-offs for: "
            f"{payload.transcript}"
        )
    )


@app.post("/process-turn", response_model=BackendTurnResponse)
async def process_turn(payload: TurnPayload) -> BackendTurnResponse:
    return await backend_process_turn(payload)


async def _stream_persona_audio(session_id: str, backend_text: str) -> AsyncGenerator[dict, None]:
    async for token in persona.stream_backend_response(backend_text):
        yield {"type": "persona_token", "content": token["token"], "is_final": token["is_final"]}

    async for audio_frame in tts.text_to_speech(backend_text, session_id=session_id):
        yield {
            "type": "audio_frame",
            "index": audio_frame.index,
            "content": audio_frame.data,
            "is_final": audio_frame.is_final,
        }


@app.websocket("/ws/{session_id}")
async def interview_socket(websocket: WebSocket, session_id: str) -> None:
    await ws_manager.connect(session_id=session_id, websocket=websocket)
    await session_manager.start_session(session_id)
    await turn_manager.start_turn(session_id=session_id, turn_index=1)

    try:
        while True:
            payload = await websocket.receive_json()

            if payload.get("type") == "audio":
                chunk = AudioChunk(
                    session_id=session_id,
                    chunk_id=int(payload.get("chunk_id", 0)),
                    content=str(payload.get("content", "")),
                    is_final=bool(payload.get("is_final", False)),
                )
                event = await stt.speech_to_text(chunk)
                await session_manager.touch(session_id, voice_activity=bool(event.transcript))
                await turn_manager.ingest_event(event)

                if event.interrupted:
                    await ws_manager.send_json(session_id, {"type": "stt_interrupt", "detail": "stream interrupted"})
                    continue

                if event.transcript:
                    label = "final" if event.final else "partial"
                    await ws_manager.send_json(
                        session_id,
                        {"type": f"stt_{label}", "transcript": event.transcript, "confidence": event.confidence},
                    )

                completed = await turn_manager.detect_completion(session_id)
                if not completed:
                    continue

                print("[STT] Transcript received")
                print("[Turn] Completion detected")

                backend_response = await turn_manager.submit_to_backend(
                    session_id=session_id,
                    backend_client=backend_process_turn,
                )
                print("[API] Sent to backend")
                print("[Persona] Streaming response")

                async for frame in _stream_persona_audio(session_id=session_id, backend_text=backend_response.response_text):
                    await ws_manager.send_json(session_id, frame)

                print("[TTS] Audio output generated")
                state = await session_manager.increment_turn(session_id)
                if state is not None:
                    await turn_manager.start_turn(session_id=session_id, turn_index=state.turn_index + 1)

            elif payload.get("type") == "stop":
                await turn_manager.explicit_stop(session_id)
            elif payload.get("type") == "presence":
                snapshot = await presence.snapshot(
                    camera_active=bool(payload.get("camera_active", True)),
                    tab_focused=bool(payload.get("tab_focused", True)),
                    response_latency_ms=int(payload.get("response_latency_ms", 0)),
                )
                await ws_manager.send_json(session_id, {"type": "presence", **snapshot.model_dump()})
            elif payload.get("type") == "silence_check":
                is_silent = await session_manager.detect_silence(session_id)
                if is_silent:
                    action = await recovery.on_silence()
                    await ws_manager.send_json(session_id, {"type": "recovery", **action.model_dump()})

            timed_out = await session_manager.track_time(session_id)
            if timed_out:
                await ws_manager.send_json(session_id, {"type": "session_timeout"})
                break

    except WebSocketDisconnect:
        pass
    finally:
        await session_manager.end_session(session_id)
        await ws_manager.disconnect(session_id=session_id, websocket=websocket)


async def run_demo() -> None:
    await session_manager.start_session("demo")
    await turn_manager.start_turn("demo", turn_index=1)

    chunks = [
        AudioChunk(session_id="demo", chunk_id=1, content="I designed a cache", is_final=False),
        AudioChunk(session_id="demo", chunk_id=2, content="with ttl and invalidation", is_final=True),
    ]

    for chunk in chunks:
        event = await stt.speech_to_text(chunk)
        if event.transcript:
            print("[STT] Transcript received")
        await turn_manager.ingest_event(event)

    completed = await turn_manager.detect_completion("demo")
    if completed:
        print("[Turn] Completion detected")
        response = await turn_manager.submit_to_backend("demo", backend_client=backend_process_turn)
        print("[API] Sent to backend")
        print("[Persona] Streaming response")
        async for _ in persona.stream_backend_response(response.response_text):
            pass
        async for _ in tts.text_to_speech(response.response_text, session_id="demo"):
            pass
        print("[TTS] Audio output generated")


if __name__ == "__main__":
    asyncio.run(run_demo())
