from __future__ import annotations
import asyncio
import time

from interaction_layer.config import InteractionConfig
from interaction_layer.session.session_manager import InterviewSessionManager


def test_session_starts_and_ends() -> None:
    manager = InterviewSessionManager(InteractionConfig(session_timeout_seconds=60))

    started = asyncio.run(manager.start_session("sess-1"))
    ended = asyncio.run(manager.end_session("sess-1"))

    assert started.status == "active"
    assert ended is not None
    assert ended.status == "ended"


def test_timeout_triggers() -> None:
    manager = InterviewSessionManager(InteractionConfig(session_timeout_seconds=1))
    asyncio.run(manager.start_session("sess-timeout"))
    time.sleep(1.1)

    timed_out = asyncio.run(manager.track_time("sess-timeout"))
    state = asyncio.run(manager.get("sess-timeout"))

    assert timed_out is True
    assert state is not None
    assert state.status == "timed_out"
