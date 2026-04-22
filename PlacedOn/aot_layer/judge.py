from aot_layer.models import JudgeResult
from backend.llm.judge import evaluate_answer
from skill_taxonomy import display_skill, is_behavioral_skill

_SKILL_QUESTION_HINTS: dict[str, str] = {
    "caching": "Explain your caching strategy and its trade-offs.",
    "concurrency": "Explain how you prevent race conditions in concurrent systems.",
    "api_design": "Explain key API design choices and trade-offs.",
    "block_4_grit": "Tell me about a time you had to persist through a difficult setback.",
    "block_5_resilience": "Tell me about a time you stayed effective under pressure.",
    "block_6_social": "Tell me about a time you aligned with others through disagreement.",
    "block_6_leadership": "Tell me about a time you led others without relying on title alone.",
    "block_8_ownership": "Tell me about a time you took ownership of an outcome.",
    "block_8_curiosity": "Tell me about a time your curiosity changed your approach.",
    "block_10_calibration": "Tell me about a time you noticed your own uncertainty and adjusted.",
}


class Judge:
    async def evaluate(self, skill: str, answer: str) -> JudgeResult:
        prompt_question = _SKILL_QUESTION_HINTS.get(skill)
        if prompt_question is None:
            label = display_skill(skill)
            if is_behavioral_skill(skill):
                prompt_question = f"Tell me about a specific example that shows {label}."
            else:
                prompt_question = f"Evaluate an answer for skill={label}."
        evaluation = await evaluate_answer(question=prompt_question, answer=answer)

        direction = self._classify(score=evaluation.score)
        confidence = round(evaluation.confidence, 2)
        evidence = evaluation.strengths[:3]
        missing = evaluation.missing_concepts[:3]
        probe_recommended, recovery_possible = self._decide(direction=direction, missing=missing)

        return JudgeResult(
            direction=direction,
            score=evaluation.score,
            confidence=confidence,
            evidence=evidence,
            missing=missing,
            probe_recommended=probe_recommended,
            probe_focus=missing[:2],
            recovery_possible=recovery_possible,
            atomic_summary=evaluation.atomic_summary,
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
