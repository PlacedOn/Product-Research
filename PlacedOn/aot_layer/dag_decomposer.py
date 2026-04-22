from __future__ import annotations
from typing import Optional
from aot_layer.models import InterviewState

class DAGDecomposer:
    """
    Algorithm of Thoughts (Phase 1: DECOMPOSE)
    Implements a dependency-aware skill picker using a Directed Acyclic Graph.
    """
    
    # Define dependencies: {Target Skill: [Prerequisite Skills]}
    # Prerequisite is considered 'met' if its sigma2 <= target_sigma2
    DEPENDENCIES = {
        "block_5_resilience": ["block_4_grit"],
        "block_8_ownership": ["block_4_grit"],
        "block_6_leadership": ["block_6_social", "block_8_ownership"],
        "system_design": ["backend", "db_design"],
    }

    def __init__(self, target_sigma2: float = 0.20):
        self.target_sigma2 = target_sigma2

    async def get_next_ready_skills(self, state: InterviewState) -> list[str]:
        """Returns a list of skills that are not yet assessed and have all prerequisites met."""
        ready = []
        for skill in state.skills:
            # Skip if already assessed
            if state.sigma2.get(skill, 1.0) <= self.target_sigma2:
                continue
                
            # Check prerequisites
            prereqs = self.DEPENDENCIES.get(skill, [])
            met = True
            for pr in prereqs:
                if pr in state.skills and state.sigma2.get(pr, 1.0) > self.target_sigma2:
                    met = False
                    break
            
            if met:
                ready.append(skill)
        
        return ready

    async def pick_skill(self, state: InterviewState) -> str:
        """
        Pick the best skill to assess next. 
        Prioritizes high uncertainty among the 'ready' set.
        """
        ready_skills = await self.get_next_ready_skills(state)
        
        if not ready_skills:
            # Fallback: if somehow nothing is 'ready' (cycle or all assessed), 
            # just pick highest uncertainty among remaining.
            remaining = [s for s in state.skills if state.sigma2.get(s, 1.0) > self.target_sigma2]
            if not remaining:
                return state.skills[0]
            ready_skills = remaining

        # Pick skill with highest sigma2
        scored = [(skill, state.sigma2.get(skill, 0.0)) for skill in ready_skills]
        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[0][0]
