from typing import Any, Literal

from pydantic import BaseModel, Field


class IncomingMessage(BaseModel):
    type: Literal["answer"]
    message_id: str
    content: str = Field(min_length=1)


class OutgoingQuestion(BaseModel):
    type: Literal["question"] = "question"
    content: str
    turn: int


class InterviewState(BaseModel):
    interview_id: str
    turn: int = 0
    turn_count: int = 0
    last_question: str = ""
    last_answer: str | None = None
    skill_vector: list[float] = Field(default_factory=lambda: [0.5, 0.5, 0.5])
    skill_scores: dict[str, float] = Field(default_factory=dict)
    skill_coverage: float = 0.0
    avg_confidence: float = 0.0
    sigma2: list[float] = Field(default_factory=lambda: [0.5, 0.5, 0.5])
    performance: dict[str, Any] = Field(default_factory=dict)
    last_message_id: str | None = None
    question_history: list[str] = Field(default_factory=list)
    answer_history: list[str] = Field(default_factory=list)
    current_mode: str = "new"
    current_skill: str | None = None
    current_difficulty: str = "medium"
    latest_trust_score: float = 0.0
    anomaly_flag: bool = False
    candidate_snapshot: dict[str, Any] = Field(default_factory=dict)
