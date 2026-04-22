from __future__ import annotations
import asyncio

from layer3.bias_classifier import BiasEnforcer
from layer3.fallback import SafeQuestionPipeline
from layer3.integrity import BehavioralIntegrityEngine
from layer3.models import IntegrityInput


async def _run_pipeline() -> tuple[float, bool, str, bool]:
    question = "What is your gender identity?"
    skill = "caching"
    difficulty = "medium"

    bias = BiasEnforcer()
    safe_pipeline = SafeQuestionPipeline(bias_enforcer=bias)
    decision = await safe_pipeline.validate(question=question, skill=skill, difficulty=difficulty)

    integrity = BehavioralIntegrityEngine()
    integrity_out = await integrity.evaluate(
        IntegrityInput(
            embeddings=[
                [0.25, 0.18, 0.2],
                [0.24, 0.21, 0.18],
                [0.23, 0.19, 0.21],
            ],
            consistency_score=0.86,
            drift_score=0.14,
            confidence_signal=0.79,
        )
    )

    return (
        integrity_out.trust_score,
        integrity_out.anomaly_flag,
        decision.question,
        decision.final_bias.approved,
    )


def test_full_flow_corrects_question_and_computes_trust() -> None:
    trust_score, anomaly, question, approved = asyncio.run(_run_pipeline())

    assert trust_score > 0.6
    assert anomaly is False
    assert isinstance(question, str)
    assert question
    assert approved is True
