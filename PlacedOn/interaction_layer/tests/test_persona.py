from __future__ import annotations
import asyncio

from interaction_layer.persona.persona_engine import PersonaEngine
from interaction_layer.voice.tts import MockTTS


def test_persona_only_streams_backend_response() -> None:
    persona = PersonaEngine()
    backend_text = "Use cache invalidation and monitor latency."

    async def _collect_tokens():
        tokens = []
        async for token in persona.stream_backend_response(backend_text):
            tokens.append(token["token"])
        return tokens

    tokens = asyncio.run(_collect_tokens())
    reconstructed = " ".join(tokens)

    assert reconstructed == backend_text


def test_persona_delivery_to_tts() -> None:
    persona = PersonaEngine()
    tts = MockTTS()

    frames = asyncio.run(persona.deliver_response("Hello from backend", tts, session_id="p1"))

    assert frames
    assert frames[-1].is_final is True
