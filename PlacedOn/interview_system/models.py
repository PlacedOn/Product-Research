from __future__ import annotations
from pydantic import BaseModel, Field

from aot_layer.models import InterviewState
from layer5.models import CandidateState, FitResult, ProfileOutput


class InterviewTurnTrace(BaseModel):
    turn: int
    skill: str
    mode: str
    raw_question: str
    safe_question: str
    used_fallback: bool
    trust_score: float = Field(ge=0.0, le=1.0)
    anomaly_flag: bool
    answer: str
    judge_confidence: float = Field(ge=0.0, le=1.0)
    adjusted_confidence: float = Field(ge=0.0, le=1.0)
    drift_score: float = 0.0
    best_match: str = "C"


class FullStackResult(BaseModel):
    candidate_id: str
    final_state: InterviewState
    turns: list[InterviewTurnTrace]
    candidate_profile: CandidateState
    fit: FitResult
    rendered_profile: ProfileOutput
