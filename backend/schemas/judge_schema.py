from typing import Literal

from pydantic import BaseModel, Field, field_validator


class JudgeInput(BaseModel):
    question: str = Field(min_length=1)
    answer: str = Field(min_length=1)


class JudgeOutput(BaseModel):
    score: float = Field(ge=0.0, le=1.0)
    confidence: float = Field(ge=0.0, le=1.0)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    missing_concepts: list[str] = Field(default_factory=list)
    intent: Literal["no_understanding", "partial_understanding", "clear_understanding"] = "partial_understanding"
    depth: Literal["shallow", "basic", "good", "strong"] = "basic"
    clarity: Literal["poor", "okay", "clear"] = "okay"

    @field_validator("score", "confidence", mode="before")
    @classmethod
    def _coerce_range(cls, value: float) -> float:
        numeric = float(value)
        if numeric < 0.0:
            return 0.0
        if numeric > 1.0:
            return 1.0
        return numeric
