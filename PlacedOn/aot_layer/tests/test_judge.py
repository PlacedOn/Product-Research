import asyncio

from aot_layer.judge import Judge


def test_partial_answer_recommends_probe() -> None:
    judge = Judge()
    result = asyncio.run(judge.evaluate("caching", "I use ttl and cache key strategy."))

    assert result.direction == "partial"
    assert result.probe_recommended is True
    assert "invalidation" in result.missing


def test_wrong_answer_recovery_possible() -> None:
    judge = Judge()
    result = asyncio.run(judge.evaluate("concurrency", "I don't know this."))

    assert result.direction == "wrong"
    assert result.recovery_possible is True
    assert result.confidence == 0.0


def test_strong_answer_moves_on_with_high_confidence() -> None:
    judge = Judge()
    result = asyncio.run(
        judge.evaluate(
            "api_design",
            "I rely on versioning, pagination, and rate limit protections per tenant.",
        )
    )

    assert result.direction == "correct"
    assert result.probe_recommended is False
    assert result.confidence == 1.0
