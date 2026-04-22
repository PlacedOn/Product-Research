from __future__ import annotations
import asyncio

from layer3.integrity import BehavioralIntegrityEngine
from layer3.models import IntegrityInput


def test_stable_embeddings_produce_higher_trust() -> None:
    engine = BehavioralIntegrityEngine()
    stable = IntegrityInput(
        embeddings=[
            [0.2, 0.2, 0.1],
            [0.21, 0.19, 0.1],
            [0.2, 0.2, 0.09],
        ],
        consistency_score=0.9,
        drift_score=0.1,
        confidence_signal=0.85,
    )

    result = asyncio.run(engine.evaluate(stable))
    assert 0.0 <= result.trust_score <= 1.0
    assert result.trust_score > 0.7
    assert result.anomaly_flag is False


def test_large_drift_lowers_trust_and_sets_anomaly() -> None:
    engine = BehavioralIntegrityEngine()
    unstable = IntegrityInput(
        embeddings=[
            [0.8, 0.1, 0.1],
            [-0.8, -0.2, 0.1],
            [0.7, -0.6, 0.2],
        ],
        consistency_score=0.25,
        drift_score=0.9,
        confidence_signal=0.2,
    )

    result = asyncio.run(engine.evaluate(unstable))
    assert result.trust_score < 0.45
    assert result.anomaly_flag is True
