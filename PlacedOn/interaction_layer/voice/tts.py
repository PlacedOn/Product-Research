from __future__ import annotations
from typing import Optional

import asyncio

from interaction_layer.config import InteractionConfig
from interaction_layer.models import AudioFrame


class MockTTS:
    def __init__(self, config:Optional[ InteractionConfig] = None) -> None:
        self._config = config or InteractionConfig()
        self._interrupted_sessions: set[str] = set()

    def interrupt(self, session_id: str) -> None:
        self._interrupted_sessions.add(session_id)

    async def text_to_speech(self, text: str, session_id: str = "session"):
        words = text.split()
        if not words:
            yield AudioFrame(session_id=session_id, index=0, data="", is_final=True)
            return

        chunk_size = max(self._config.tts_chunk_words, 1)
        chunks = [" ".join(words[idx : idx + chunk_size]) for idx in range(0, len(words), chunk_size)]

        for idx, chunk in enumerate(chunks):
            if session_id in self._interrupted_sessions:
                self._interrupted_sessions.discard(session_id)
                yield AudioFrame(session_id=session_id, index=idx, data="", is_final=True)
                return

            await asyncio.sleep(0)
            yield AudioFrame(
                session_id=session_id,
                index=idx,
                data=chunk,
                is_final=idx == len(chunks) - 1,
            )
