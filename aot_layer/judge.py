from aot_layer.mock_llm import SKILL_CONCEPTS
from aot_layer.models import JudgeResult


class Judge:
    async def evaluate(self, skill: str, answer: str) -> JudgeResult:
        concepts = SKILL_CONCEPTS.get(skill, ["trade-off", "scalability", "reliability"])

        evidence = self._extract_evidence(answer=answer, concepts=concepts)
        missing = self._identify_missing(concepts=concepts, evidence=evidence)
        direction = self._classify(evidence=evidence, total_required=len(concepts))
        confidence = self._assign_confidence(evidence=evidence, total_required=len(concepts))
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

    def _extract_evidence(self, answer: str, concepts: list[str]) -> list[str]:
        lowered = answer.lower()
        return [concept for concept in concepts if concept in lowered]

    def _identify_missing(self, concepts: list[str], evidence: list[str]) -> list[str]:
        return [concept for concept in concepts if concept not in evidence]

    def _classify(self, evidence: list[str], total_required: int) -> str:
        if len(evidence) == total_required:
            return "correct"
        if len(evidence) > 0:
            return "partial"
        return "wrong"

    def _assign_confidence(self, evidence: list[str], total_required: int) -> float:
        return round(len(evidence) / max(total_required, 1), 2)

    def _decide(self, direction: str, missing: list[str]) -> tuple[bool, bool]:
        probe_recommended = direction == "partial" and len(missing) > 0
        recovery_possible = direction == "wrong"
        return probe_recommended, recovery_possible
