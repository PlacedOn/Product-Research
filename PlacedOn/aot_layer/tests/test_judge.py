from __future__ import annotations
import asyncio

from aot_layer.judge import Judge
from backend.schemas.judge_schema import JudgeOutput


def test_partial_answer_recommends_probe(monkeypatch) -> None:
    async def fake_evaluate_answer(*_args, **_kwargs):
        return JudgeOutput(
            score=0.58,
            confidence=0.68,
            strengths=["Clear collaboration example"],
            weaknesses=["Limited outcome detail"],
            missing_concepts=["measurable result"],
            intent="partial_understanding",
            depth="basic",
            clarity="okay",
        )

    monkeypatch.setattr("aot_layer.judge.evaluate_answer", fake_evaluate_answer)

    judge = Judge()
    result = asyncio.run(
        judge.evaluate("block_6_social", "I aligned two teammates and helped them move forward.")
    )

    assert result.direction == "partial"
    assert result.probe_recommended is True
    assert "measurable result" in result.missing


def test_wrong_answer_recovery_possible(monkeypatch) -> None:
    async def fake_evaluate_answer(*_args, **_kwargs):
        return JudgeOutput(
            score=0.2,
            confidence=0.3,
            strengths=[],
            weaknesses=["No concrete example"],
            missing_concepts=["specific situation"],
            intent="no_understanding",
            depth="shallow",
            clarity="poor",
        )

    monkeypatch.setattr("aot_layer.judge.evaluate_answer", fake_evaluate_answer)

    judge = Judge()
    result = asyncio.run(judge.evaluate("block_4_grit", "I don't know this."))

    assert result.direction == "wrong"
    assert result.recovery_possible is True
    assert result.confidence == 0.3


def test_strong_answer_moves_on_with_high_confidence(monkeypatch) -> None:
    async def fake_evaluate_answer(*_args, **_kwargs):
        return JudgeOutput(
            score=0.91,
            confidence=0.88,
            strengths=["Specific ownership example", "Clear result"],
            weaknesses=[],
            missing_concepts=[],
            intent="clear_understanding",
            depth="strong",
            clarity="clear",
        )

    monkeypatch.setattr("aot_layer.judge.evaluate_answer", fake_evaluate_answer)

    judge = Judge()
    result = asyncio.run(
        judge.evaluate(
            "block_8_ownership",
            "I took ownership of the outage recovery, reset priorities, and communicated the plan until the service stabilized.",
        )
    )

    assert result.direction == "correct"
    assert result.probe_recommended is False
    assert result.confidence == 0.88
