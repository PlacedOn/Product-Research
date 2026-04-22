from __future__ import annotations
from pydantic import BaseModel, Field

from skill_taxonomy import DEFAULT_TRACKED_SKILLS


class Layer2Config(BaseModel):
    tracked_skills: list[str] = Field(default_factory=lambda: list(DEFAULT_TRACKED_SKILLS))
    base_score: float = 0.5
    base_uncertainty: float = 0.8
    uncertainty_floor: float = 0.05
