from __future__ import annotations

from collections import defaultdict

from interaction_layer.models import AudioChunk, STTEvent


class MockSTT:
    def __init__(self) -> None:
        self._buffers: dict[str, list[str]] = defaultdict(list)

    async def speech_to_text(self, audio_chunk: AudioChunk) -> STTEvent:
        text = audio_chunk.content.strip()

        if text == "__interrupt__":
            self._buffers[audio_chunk.session_id].clear()
            return STTEvent(
                session_id=audio_chunk.session_id,
                transcript="",
                partial=False,
                final=False,
                confidence=0.0,
                interrupted=True,
            )

        if not text:
            return STTEvent(
                session_id=audio_chunk.session_id,
                transcript="",
                partial=True,
                final=False,
                confidence=0.0,
                interrupted=False,
            )

        self._buffers[audio_chunk.session_id].append(text)
        transcript = " ".join(self._buffers[audio_chunk.session_id])

        token_count = len(transcript.split())
        confidence = min(0.35 + (token_count / 40.0), 0.99)

        if audio_chunk.is_final:
            self._buffers[audio_chunk.session_id].clear()

        return STTEvent(
            session_id=audio_chunk.session_id,
            transcript=transcript,
            partial=not audio_chunk.is_final,
            final=audio_chunk.is_final,
            confidence=round(confidence, 4),
            interrupted=False,
        )
