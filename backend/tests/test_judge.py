import asyncio
import json

from backend.llm.judge import evaluate_answer


def test_judge_returns_valid_structure(monkeypatch) -> None:
    def fake_call_ollama(*_args, **_kwargs):
        return json.dumps(
            {
                "score": 0.74,
                "confidence": 0.81,
                "strengths": ["Clear trade-off articulation"],
                "weaknesses": ["Missing failure-path detail"],
                "missing_concepts": ["cache invalidation strategy"],
            }
        )

    monkeypatch.setattr("backend.llm.judge.call_ollama", fake_call_ollama)

    result = asyncio.run(
        evaluate_answer(
            question="How would you design a resilient cache layer?",
            answer="I would use cache-aside with TTL and monitor hit ratio.",
        )
    )

    assert 0.0 <= result.score <= 1.0
    assert 0.0 <= result.confidence <= 1.0
    assert len(result.strengths) > 0
    assert len(result.weaknesses) > 0
    assert len(result.missing_concepts) > 0


def test_judge_fallback_is_neutral(monkeypatch) -> None:
    def invalid_call_ollama(*_args, **_kwargs):
        return "not-json"

    monkeypatch.setattr("backend.llm.judge.call_ollama", invalid_call_ollama)

    try:
        asyncio.run(
            evaluate_answer(
                question="Explain race condition prevention.",
                answer="I am not sure.",
            )
        )
        raise AssertionError("Expected ValueError for invalid JSON")
    except ValueError:
        pass
