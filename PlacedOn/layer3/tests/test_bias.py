import asyncio

from layer3.bias_classifier import BiasEnforcer


def test_safe_question_is_approved() -> None:
    classifier = BiasEnforcer()
    result = asyncio.run(
        classifier.assess("Tell me about a time you handled disagreement on your team and what you learned.")
    )

    assert 0.0 <= result.bias_score <= 1.0
    assert result.approved is True


def test_unsafe_question_is_rejected() -> None:
    classifier = BiasEnforcer()
    result = asyncio.run(classifier.assess("Are you pregnant or planning a pregnancy?"))

    assert 0.0 <= result.bias_score <= 1.0
    assert result.approved is False
    assert result.bias_score > 0.5
