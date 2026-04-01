import asyncio
import time

from interaction_layer.config import InteractionConfig
from interaction_layer.error_handling.recovery import RecoveryManager
from interaction_layer.models import BackendTurnResponse, STTEvent
from interaction_layer.turn.turn_manager import TurnManager


async def _backend(payload):
    return BackendTurnResponse(response_text=f"ACK:{payload.transcript}")


def test_detect_completion_and_send_payload() -> None:
    manager = TurnManager(InteractionConfig(silence_threshold_seconds=0.2))

    asyncio.run(manager.start_turn("turn-1", 1))
    asyncio.run(
        manager.ingest_event(
            STTEvent(
                session_id="turn-1",
                transcript="I would shard by tenant",
                partial=False,
                final=True,
                confidence=0.8,
            )
        )
    )

    completed = asyncio.run(manager.detect_completion("turn-1"))
    response = asyncio.run(manager.submit_to_backend("turn-1", _backend))

    assert completed is True
    assert "ACK:" in response.response_text


def test_silence_and_recovery_actions() -> None:
    manager = TurnManager(InteractionConfig(silence_threshold_seconds=0.1))
    recovery = RecoveryManager()

    asyncio.run(manager.start_turn("turn-2", 1))
    asyncio.run(
        manager.ingest_event(
            STTEvent(
                session_id="turn-2",
                transcript="partial answer",
                partial=True,
                final=False,
                confidence=0.6,
            )
        )
    )

    time.sleep(0.12)
    completed = asyncio.run(manager.detect_completion("turn-2"))
    silence_action = asyncio.run(recovery.on_silence())
    stt_failure_action = asyncio.run(recovery.on_stt_failure())

    assert completed is True
    assert silence_action.action == "reprompt"
    assert stt_failure_action.action == "retry"
