from __future__ import annotations
from typing import Literal

from pydantic import BaseModel, Field


class AudioChunk(BaseModel):
    session_id: str
    chunk_id: int
    content: str
    is_final: bool = False


class STTEvent(BaseModel):
    session_id: str
    transcript: str
    partial: bool
    final: bool
    confidence: float = Field(ge=0.0, le=1.0)
    interrupted: bool = False


class AudioFrame(BaseModel):
    session_id: str
    index: int
    data: str
    is_final: bool = False


class SessionState(BaseModel):
    session_id: str
    status: Literal["active", "ended", "timed_out"] = "active"
    started_at: float
    last_activity_at: float
    last_voice_activity_at: float
    turn_index: int = 0


class TurnState(BaseModel):
    session_id: str
    turn_index: int
    transcript: str = ""
    completed: bool = False
    explicit_stop: bool = False
    last_update_at: float


class TurnPayload(BaseModel):
    session_id: str
    turn_index: int
    transcript: str


class BackendTurnResponse(BaseModel):
    response_text: str


class PresenceState(BaseModel):
    present: bool
    active: bool
    camera_active: bool
    tab_focused: bool
    response_latency_ms: int = 0


class RecoveryAction(BaseModel):
    action: Literal["reprompt", "clarify", "retry", "continue"]
    message: str
    retryable: bool
