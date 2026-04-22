from __future__ import annotations
import asyncio

from layer3.bias_classifier import BiasEnforcer
from layer3.config import Layer3Config
from layer3.fallback import FallbackGenerator, SafeQuestionPipeline
from layer3.models import BiasAssessment


class AlwaysUnsafeBias:
    async def assess(self, question: str) -> BiasAssessment:
        return BiasAssessment(bias_score=0.99, approved=False)


def test_unsafe_question_generates_safe_fallback() -> None:
    classifier = BiasEnforcer()
    pipeline = SafeQuestionPipeline(bias_enforcer=classifier)

    result = asyncio.run(
        pipeline.validate(
            question="What is your nationality and where are your parents from?",
            skill="scalability",
            difficulty="medium",
        )
    )

    assert result.used_fallback is True
    assert isinstance(result.question, str)
    assert len(result.question.strip()) > 0
    assert result.final_bias.approved is True


def test_generic_safe_fallback_used_when_second_validation_fails() -> None:
    pipeline = SafeQuestionPipeline(
        bias_enforcer=AlwaysUnsafeBias(),
        fallback_generator=FallbackGenerator(),
        config=Layer3Config(),
    )

    result = asyncio.run(
        pipeline.validate(
            question="Unsafe question",
            skill="dsa",
            difficulty="hard",
        )
    )

    assert result.generic_fallback_used is True
    assert result.question == Layer3Config().generic_safe_question
