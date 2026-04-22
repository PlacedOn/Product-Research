from __future__ import annotations
import asyncio
import os
import sys

if __package__ in (None, ""):
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from layer3.bias_classifier import BiasEnforcer
from layer3.fallback import SafeQuestionPipeline
from layer3.integrity import BehavioralIntegrityEngine
from layer3.models import IntegrityInput, Layer3Output


async def run_demo() -> None:
    bias = BiasEnforcer()
    safe_pipeline = SafeQuestionPipeline(bias_enforcer=bias)
    integrity = BehavioralIntegrityEngine()

    questions = [
        ("How would you tune cache invalidation for high read traffic?", "caching", "medium"),
        ("Are you married and what is your relationship status?", "scalability", "easy"),
    ]

    for question, skill, difficulty in questions:
        decision = await safe_pipeline.validate(question=question, skill=skill, difficulty=difficulty)
        if decision.initial_bias.approved:
            print(f"[Bias] Score: {decision.initial_bias.bias_score} -> Approved")
        else:
            print(f"[Bias] Score: {decision.initial_bias.bias_score} -> Rejected")
            print("[Fallback] Generated safe question")
            if decision.generic_fallback_used:
                print("[Fallback] Generic safe fallback used")

        print(f"[Question] Sent: {decision.question}")

    integrity_out = await integrity.evaluate(
        IntegrityInput(
            embeddings=[
                [0.21, 0.17, 0.12, 0.08],
                [0.2, 0.16, 0.11, 0.1],
                [0.18, 0.16, 0.1, 0.11],
            ],
            consistency_score=0.82,
            drift_score=0.21,
            confidence_signal=0.76,
        )
    )

    print(f"[Integrity] Trust score: {integrity_out.trust_score}")

    final = Layer3Output(
        trust_score=integrity_out.trust_score,
        anomaly_flag=integrity_out.anomaly_flag,
        question=decision.question,
        bias_score=decision.final_bias.bias_score,
        approved=decision.final_bias.approved,
        used_fallback=decision.used_fallback,
    )
    print("[Layer3] Final output ready")
    print(final.model_dump())


if __name__ == "__main__":
    asyncio.run(run_demo())
