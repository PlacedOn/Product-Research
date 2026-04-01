import asyncio

from interaction_layer.models import AudioChunk
from interaction_layer.voice.stt import MockSTT
from interaction_layer.voice.tts import MockTTS


def test_stt_returns_partial_and_final_transcript() -> None:
    stt = MockSTT()

    partial = asyncio.run(
        stt.speech_to_text(AudioChunk(session_id="s1", chunk_id=1, content="hello backend", is_final=False))
    )
    final = asyncio.run(
        stt.speech_to_text(AudioChunk(session_id="s1", chunk_id=2, content="systems", is_final=True))
    )

    assert partial.partial is True
    assert final.final is True
    assert "hello" in final.transcript


def test_tts_returns_audio_stream_frames() -> None:
    tts = MockTTS()

    async def _collect():
        frames = []
        async for frame in tts.text_to_speech("this is a streamed response", session_id="s1"):
            frames.append(frame)
        return frames

    frames = asyncio.run(_collect())
    assert frames
    assert frames[-1].is_final is True
