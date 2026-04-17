from pydantic import BaseModel, Field


class AoTConfig(BaseModel):
    skills: list[str] = Field(default_factory=lambda: ["caching", "concurrency", "api_design"])
    max_consecutive_per_skill: int = 2
    max_probes_per_skill: int = 2
    max_retries_per_skill: int = 2
    max_turns_per_skill: int = 4
    default_difficulty: str = "medium"
    total_turn_limit: int = 8
