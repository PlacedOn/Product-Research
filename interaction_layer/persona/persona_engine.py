from __future__ import annotations

import asyncio

from interaction_layer.models import AudioFrame
from interaction_layer.voice.tts import MockTTS


class PersonaEngine:
    async def stream_backend_response(self, backend_text: str):
        words = backend_text.split()
        for idx, word in enumerate(words):
            await asyncio.sleep(0)
            yield {"index": idx, "token": word, "is_final": idx == len(words) - 1}

    async def deliver_response(self, backend_text: str, tts: MockTTS, session_id: str) -> list[AudioFrame]:
        frames: list[AudioFrame] = []
        async for frame in tts.text_to_speech(backend_text, session_id=session_id):
            frames.append(frame)
        return frames
