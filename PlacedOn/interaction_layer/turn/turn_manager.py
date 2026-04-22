from __future__ import annotations
from typing import Optional

import time
from collections.abc import Awaitable, Callable

from interaction_layer.config import InteractionConfig
from interaction_layer.models import BackendTurnResponse, STTEvent, TurnPayload, TurnState

BackendClient = Callable[[TurnPayload], Awaitable[BackendTurnResponse]]


class TurnManager:
    def __init__(self, config:Optional[ InteractionConfig] = None) -> None:
        self._config = config or InteractionConfig()
        self._turns: dict[str, TurnState] = {}

    async def start_turn(self, session_id: str, turn_index: int) -> TurnState:
        state = TurnState(
            session_id=session_id,
            turn_index=turn_index,
            transcript="",
            completed=False,
            explicit_stop=False,
            last_update_at=time.monotonic(),
        )
        self._turns[session_id] = state
        return state

    async def ingest_event(self, event: STTEvent) -> TurnState:
        state = self._turns.get(event.session_id)
        if state is None:
            state = await self.start_turn(event.session_id, turn_index=1)

        if event.interrupted:
            updated = state.model_copy(update={"transcript": "", "completed": False, "last_update_at": time.monotonic()})
            self._turns[event.session_id] = updated
            return updated

        updated = state.model_copy(
            update={
                "transcript": event.transcript,
                "completed": event.final,
                "last_update_at": time.monotonic(),
            }
        )
        self._turns[event.session_id] = updated
        return updated

    async def explicit_stop(self, session_id: str) ->Optional[ TurnState]:
        state = self._turns.get(session_id)
        if state is None:
            return None
        updated = state.model_copy(update={"explicit_stop": True, "completed": True, "last_update_at": time.monotonic()})
        self._turns[session_id] = updated
        return updated

    async def detect_completion(self, session_id: str) -> bool:
        state = self._turns.get(session_id)
        if state is None:
            return False
        if state.completed or state.explicit_stop:
            return True
        silence_elapsed = time.monotonic() - state.last_update_at
        return silence_elapsed >= self._config.silence_threshold_seconds and bool(state.transcript.strip())

    async def submit_to_backend(self, session_id: str, backend_client: BackendClient) -> BackendTurnResponse:
        state = self._turns.get(session_id)
        if state is None:
            raise ValueError("No active turn state")

        payload = TurnPayload(
            session_id=session_id,
            turn_index=state.turn_index,
            transcript=state.transcript.strip(),
        )
        return await backend_client(payload)
