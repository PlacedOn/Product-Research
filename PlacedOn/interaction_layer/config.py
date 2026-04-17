from pydantic import BaseModel, Field


class InteractionConfig(BaseModel):
    silence_threshold_seconds: float = 3.5
    session_timeout_seconds: int = 1800
    max_turn_seconds: int = 120
    tts_chunk_words: int = 4
    presence_latency_warn_ms: int = 1500
    stt_min_confidence: float = Field(default=0.45, ge=0.0, le=1.0)
