from __future__ import annotations
import asyncio

from layer2.adapter import CapabilityAdapter
from layer2.behavioral import BehavioralSignalTracker


def test_stable_answers_yield_higher_consistency() -> None:
    adapter = CapabilityAdapter()
    tracker = BehavioralSignalTracker()

    history = [
        asyncio.run(adapter.process("I took ownership of the issue and aligned the team on a recovery plan.")),
        asyncio.run(adapter.process("I owned the problem, coordinated stakeholders, and kept the recovery plan moving.")),
        asyncio.run(adapter.process("I followed through on the plan and kept everyone aligned until the issue closed.")),
    ]

    signals = asyncio.run(tracker.track(history))
    assert signals.consistency_score > 0.6


def test_sudden_semantic_change_raises_drift() -> None:
    adapter = CapabilityAdapter()
    tracker = BehavioralSignalTracker()

    history = [
        asyncio.run(adapter.process("I kept the team aligned during the recovery and followed through on the plan.")),
        asyncio.run(adapter.process("I owned the risk, checked assumptions, and kept communication clear.")),
        asyncio.run(adapter.process("I like cooking and football stories unrelated to work.")),
    ]

    signals = asyncio.run(tracker.track(history))
    assert signals.drift_score > 0.2
