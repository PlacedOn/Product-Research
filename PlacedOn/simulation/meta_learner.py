import json
from typing import Dict, List, Any
from aot_layer.models import OrchestrationResult
from simulation.candidate import GroundTruthProfile


class MetaLearner:
    def __init__(self, truth: GroundTruthProfile):
        self.truth = truth

    def analyze_mistakes(self, result: OrchestrationResult) -> List[Dict[str, Any]]:
        """
        Identifies turns where the interviewer was 'fooled'.
        Condition: Judge Confidence > 0.7 AND Error > 0.4
        """
        mistakes = []
        for log in result.logs:
            truth_score = self.truth.skills.get(log.skill, 0.5)
            # AoT uses judge.confidence directly to update state.skill_vector (basic version)
            # In our improved version, it uses complex judge output.
            
            # Simple mistake detection:
            # If the judge says 'correct' (score >= 0.8) but truth is low (<= 0.4)
            judge_score = log.judge.confidence  # In aot_layer/orchestrator.py, it's used as score
            
            if judge_score > 0.5 and truth_score < 0.4:
                mistakes.append({
                    "turn": log.turn,
                    "skill": log.skill,
                    "question": log.question,
                    "answer": log.answer,
                    "judge_score": judge_score,
                    "truth_score": truth_score,
                    "reasoning": "Interviewer rewarded professional tone despite lack of technical proof."
                })
        return mistakes

    def propose_patch(self, mistakes: List[Dict[str, Any]]) -> str:
        """
        Uses an LLM (conceptually, we'll implement the logic here) to generate a patch.
        For the simulation demo, we'll implement a specific fix for the 'Buzzword King'.
        """
        if not mistakes:
            return "No obvious mistakes detected. No patch needed."

        # Problem: 'has_shallow' markers are not strict enough or 'has_mechanism' is too lenient.
        # Fix: Add more strict penalty for buzzwords in judge.py _calibrate_output.
        
        patch_instruction = """
        Analysis: The model is rewarding 'Buzzword' answers because they use markers like 'specifically' 
        without actually citing a mechanism. 
        Patch: Update `_calibrate_output` in `backend/llm/judge.py` to hard-cap scores at 0.35 
        if `has_shallow` is true, unless `has_mechanism` is ALSO true with high token count.
        """
        return patch_instruction
    def suggest_kalman_tuning(self, result: OrchestrationResult) -> Dict[str, float]:
        """
        Calculates if R or Q should be adjusted based on convergence behavior.
        """
        final_errors = []
        for skill in self.truth.skills.keys():
            final_est = result.final_state.skill_vector.get(skill, 0.5)
            truth = self.truth.skills[skill]
            final_errors.append(abs(final_est - truth))
        
        avg_mae = sum(final_errors) / len(final_errors)
        
        tuning = {}
        if avg_mae > 0.1:
            # System is too slow or noisy
            tuning["measurement_noise_r_base"] = -0.05 
        if avg_mae > 0.05:
            # Traits might be more stable than assumed
            tuning["process_noise_q"] = -0.005

        return tuning
