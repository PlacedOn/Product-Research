import os
from functools import lru_cache

from pydantic import BaseModel, Field


class Settings(BaseModel):
    redis_url: str = Field(default="redis://localhost:6379/0")
    session_ttl_seconds: int = Field(default=1800)
    stream_delay_seconds: float = Field(default=0.05)
    initial_question: str = Field(default="Tell me about a backend system you designed recently.")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        redis_url=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
        session_ttl_seconds=int(os.getenv("SESSION_TTL_SECONDS", "1800")),
        stream_delay_seconds=float(os.getenv("STREAM_DELAY_SECONDS", "0.05")),
        initial_question=os.getenv(
            "INITIAL_QUESTION",
            "Tell me about a backend system you designed recently.",
        ),
    )
