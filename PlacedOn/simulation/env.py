from typing import Dict, List

from aot_layer.orchestrator import AoTOrchestrator
from aot_layer.models import StartInput, OrchestrationResult
from simulation.candidate import SyntheticCandidate, GroundTruthProfile


class InterviewEnv:
    def __init__(self, orchestrator: AoTOrchestrator, candidate: SyntheticCandidate):
        self.orchestrator = orchestrator
        self.candidate = candidate

    async def run_session(self, max_turns: int = 5) -> OrchestrationResult:
        """
        Runs a simulation session.
        """
        skills = self.orchestrator.config.skills
        start = StartInput(
            skill_vector=[0.5] * len(skills),
            sigma2=[0.95] * len(skills),
            past_attempts_per_skill={s: 0 for s in skills},
        )

        async def simulation_answer_provider(turn: int, question: str, skill: str, mode: str) -> str:
            # The candidate responds based on hidden traits
            return await self.candidate.generate_response(question, skill)

        result = await self.orchestrator.run(
            start_input=start,
            answer_provider=simulation_answer_provider,
            max_turns=max_turns
        )
        return result

    def calculate_error(self, actual_scores: Dict[str, float]) -> Dict[str, float]:
        """
        Calculates the error between the hidden ground truth and the interviewer's estimates.
        """
        errors = {}
        for skill, truth in self.candidate.profile.skills.items():
            estimate = actual_scores.get(skill, 0.5)
            errors[skill] = abs(estimate - truth)
        return errors
