from typing import Literal

from pydantic import BaseModel, Field


class CandidateProfile(BaseModel):
    name: str = Field(min_length=1)
    experience_years: float = Field(ge=0)
    skills: list[str] = Field(default_factory=list)
    projects: list[str] = Field(default_factory=list)
    education: str = ""


class JobProfile(BaseModel):
    role: str = Field(min_length=1)
    level: Literal["intern", "junior", "mid", "senior"]
    required_skills: list[str] = Field(default_factory=list)
    preferred_skills: list[str] = Field(default_factory=list)


class GeneratorInput(BaseModel):
    candidate: CandidateProfile
    job: JobProfile
    focus_skill: str = Field(min_length=1)
    strategy: Literal["behavioral", "conceptual", "system_design", "deep_dive", "follow_up"]
    previous_context: list[dict] = Field(default_factory=list)


class QuestionOutput(BaseModel):
    question: str = Field(min_length=1)
    skill: str = Field(min_length=1)
    difficulty: Literal["easy", "medium", "hard"]
    type: Literal["conceptual", "system_design", "behavioral"]
