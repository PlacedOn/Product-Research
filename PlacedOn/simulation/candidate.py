import random
from typing import Dict

from pydantic import BaseModel


class GroundTruthProfile(BaseModel):
    skills: Dict[str, float]
    persona_score: float  # 0.0 (unprofessional) to 1.0 (highly polished)


class SyntheticCandidate:
    def __init__(self, profile: GroundTruthProfile):
        self.profile = profile
        self.buzzword_templates = [
            "I am a results-oriented professional with a passion for {skill}.",
            "In my experience with {skill}, I always prioritize scalability and excellence.",
            "I believe that {skill} is the cornerstone of a modern architecture.",
            "I have a deep understanding of {skill} and how it impacts the business.",
        ]
        self.mechanism_templates = [
            "I implement {skill} by using {mechanism} to handle {bottleneck}.",
            "The key tradeoff in {skill} is between {aspect1} and {aspect2}, which I solve by {solution}.",
            "I once debugged a {skill} issue where {error} was caused by {root_cause}.",
        ]

    async def generate_response(self, question: str, skill: str) -> str:
        """
        Generates a response based on hidden traits.
        If depth is low but persona is high, it will use buzzwords.
        If depth is high, it will include mechanisms.
        """
        skill_depth = self.profile.skills.get(skill, 0.5)
        persona = self.profile.persona_score

        # Decide if we provide a substantive answer or just buzzwords
        # Substantive content probability depends on skill_depth
        is_substantive = random.random() < skill_depth
        # Professionalism/Tone depends on persona_score
        is_professional = random.random() < persona

        if is_substantive:
            # High depth answer
            if skill == "caching":
                return "I handle caching by using Redis with a tiered TTL strategy. I use write-through for consistency but back it with an asynchronous invalidation queue to prevent latency spikes during heavy writes."
            elif skill == "concurrency":
                return "I use optimistic locking with version columns in the database and combine it with a distributed semaphore for critical sections to prevent race conditions without deadlocking the whole thread pool."
            else:
                return f"For {skill}, I focus on the underlying architecture, specifically ensuring that we handle failures gracefully with retries and circuit breakers."
        else:
            # Low depth, buzzword answer
            if is_professional:
                template = random.choice(self.buzzword_templates)
                return template.format(skill=skill)
            else:
                return "I'm not exactly sure, but I know it's really important for the team's success."


def get_archetype_buzzword_king() -> GroundTruthProfile:
    """
    Highly polished, but lacks technical depth in specific areas.
    """
    return GroundTruthProfile(
        skills={
            "caching": 0.2,
            "concurrency": 0.3,
            "api_design": 0.4,
            "system_design": 0.2,
        },
        persona_score=0.9
    )
