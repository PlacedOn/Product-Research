from aot_layer.models import JudgeResult
from backend.llm.judge import evaluate_answer

_SKILL_QUESTION_HINTS: dict[str, str] = {
    "caching": "Explain your caching strategy and its trade-offs.",
    "concurrency": "Explain how you prevent race conditions in concurrent systems.",
    "api_design": "Explain key API design choices and trade-offs.",
}


class Judge:
    async def evaluate(self, skill: str, answer: str) -> JudgeResult:
        prompt_question = _SKILL_QUESTION_HINTS.get(skill, f"Evaluate an answer for skill={skill}.")
        evaluation = await evaluate_answer(question=prompt_question, answer=answer)

        direction = self._classify(score=evaluation.score)
        confidence = round(evaluation.confidence, 2)
        evidence = evaluation.strengths[:3]
        missing = evaluation.missing_concepts[:3]
        probe_recommended, recovery_possible = self._decide(direction=direction, missing=missing)

        return JudgeResult(
            direction=direction,
            confidence=confidence,
            evidence=evidence,
            missing=missing,
            probe_recommended=probe_recommended,
            probe_focus=missing[:2],
            recovery_possible=recovery_possible,
        )

    def _classify(self, score: float) -> str:
        if score >= 0.8:
            return "correct"
        if score >= 0.4:
            return "partial"
        return "wrong"

    def _decide(self, direction: str, missing: list[str]) -> tuple[bool, bool]:
        probe_recommended = direction == "partial" and len(missing) > 0
        recovery_possible = direction == "wrong"
        return probe_recommended, recovery_possible
