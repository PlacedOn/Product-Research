from __future__ import annotations

import time

from interaction_layer.config import InteractionConfig
from interaction_layer.models import SessionState


class InterviewSessionManager:
    def __init__(self, config: InteractionConfig | None = None) -> None:
        self._config = config or InteractionConfig()
        self._sessions: dict[str, SessionState] = {}

    async def start_session(self, session_id: str) -> SessionState:
        now = time.monotonic()
        state = SessionState(
            session_id=session_id,
            status="active",
            started_at=now,
            last_activity_at=now,
            last_voice_activity_at=now,
            turn_index=0,
        )
        self._sessions[session_id] = state
        return state

    async def get(self, session_id: str) -> SessionState | None:
        return self._sessions.get(session_id)

    async def end_session(self, session_id: str) -> SessionState | None:
        state = self._sessions.get(session_id)
        if state is None:
            return None
        ended = state.model_copy(update={"status": "ended"})
        self._sessions[session_id] = ended
        return ended

    async def touch(self, session_id: str, voice_activity: bool = False) -> SessionState | None:
        state = self._sessions.get(session_id)
        if state is None:
            return None

        now = time.monotonic()
        updates = {"last_activity_at": now}
        if voice_activity:
            updates["last_voice_activity_at"] = now

        updated = state.model_copy(update=updates)
        self._sessions[session_id] = updated
        return updated

    async def increment_turn(self, session_id: str) -> SessionState | None:
        state = self._sessions.get(session_id)
        if state is None:
            return None

        updated = state.model_copy(update={"turn_index": state.turn_index + 1})
        self._sessions[session_id] = updated
        return updated

    async def track_time(self, session_id: str) -> bool:
        state = self._sessions.get(session_id)
        if state is None:
            return True

        elapsed = time.monotonic() - state.started_at
        if elapsed > self._config.session_timeout_seconds:
            timed_out = state.model_copy(update={"status": "timed_out"})
            self._sessions[session_id] = timed_out
            return True

        return False

    async def detect_silence(self, session_id: str) -> bool:
        state = self._sessions.get(session_id)
        if state is None:
            return False
        silence_for = time.monotonic() - state.last_voice_activity_at
        return silence_for >= self._config.silence_threshold_seconds
