from pydantic import BaseModel, Field


class IntegrityInput(BaseModel):
    embeddings: list[list[float]]
    consistency_score: float = Field(ge=0.0, le=1.0)
    drift_score: float = Field(ge=0.0, le=1.0)
    confidence_signal: float = Field(ge=0.0, le=1.0)


class IntegrityOutput(BaseModel):
    trust_score: float = Field(ge=0.0, le=1.0)
    anomaly_flag: bool


class BiasAssessment(BaseModel):
    bias_score: float = Field(ge=0.0, le=1.0)
    approved: bool


class GuardrailDecision(BaseModel):
    question: str
    initial_bias: BiasAssessment
    final_bias: BiasAssessment
    used_fallback: bool
    generic_fallback_used: bool


class Layer3Output(BaseModel):
    trust_score: float = Field(ge=0.0, le=1.0)
    anomaly_flag: bool
    question: str
    bias_score: float = Field(ge=0.0, le=1.0)
    approved: bool
    used_fallback: bool
