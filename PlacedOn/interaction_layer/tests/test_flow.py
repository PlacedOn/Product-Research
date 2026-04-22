from __future__ import annotations
import asyncio

from interaction_layer.models import AudioChunk, BackendTurnResponse
from interaction_layer.persona.persona_engine import PersonaEngine
from interaction_layer.session.session_manager import InterviewSessionManager
from interaction_layer.turn.turn_manager import TurnManager
from interaction_layer.voice.stt import MockSTT
from interaction_layer.voice.tts import MockTTS


async def _backend(payload):
    return BackendTurnResponse(response_text=f"Received: {payload.transcript}")


async def _run_flow() -> tuple[str, int]:
    session = InterviewSessionManager()
    turn = TurnManager()
    stt = MockSTT()
    tts = MockTTS()
    persona = PersonaEngine()

    await session.start_session("flow-1")
    await turn.start_turn("flow-1", 1)

    chunks = [
        AudioChunk(session_id="flow-1", chunk_id=1, content="I would use queues", is_final=False),
        AudioChunk(session_id="flow-1", chunk_id=2, content="and idempotency", is_final=True),
    ]

    for chunk in chunks:
        event = await stt.speech_to_text(chunk)
        await turn.ingest_event(event)

    completed = await turn.detect_completion("flow-1")
    if not completed:
        return "", 0

    backend_response = await turn.submit_to_backend("flow-1", backend_client=_backend)

    token_count = 0
    async for _ in persona.stream_backend_response(backend_response.response_text):
        token_count += 1

    audio_count = 0
    async for _ in tts.text_to_speech(backend_response.response_text, session_id="flow-1"):
        audio_count += 1

    await session.increment_turn("flow-1")
    return backend_response.response_text, token_count + audio_count


def test_full_interaction_flow() -> None:
    text, stream_count = asyncio.run(_run_flow())

    assert "Received:" in text
    assert stream_count > 0
