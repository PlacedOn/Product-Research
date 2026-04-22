from pydantic import BaseModel, Field

from skill_taxonomy import DEFAULT_AOT_SKILLS


class AoTConfig(BaseModel):
    skills: list[str] = Field(default_factory=lambda: list(DEFAULT_AOT_SKILLS))
    max_consecutive_per_skill: int = 3
    max_probes_per_skill: int = 2
    max_retries_per_skill: int = 1
    max_turns_per_skill: int = 4
    default_difficulty: str = "medium"
    total_turn_limit: int = 8
    target_sigma2: float = 0.14  # True Markov stopping condition
    process_noise_q: float = 0.002
    measurement_noise_r_base: float = 0.14
    strategic_probe_score_floor: float = 0.45
    strategic_probe_score_ceiling: float = 0.78
    strategic_probe_missing_threshold: int = 1
