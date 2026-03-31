from pydantic import BaseModel, Field


class Layer3Config(BaseModel):
    trust_weight_consistency: float = 0.45
    trust_weight_stability: float = 0.35
    trust_weight_confidence: float = 0.20
    anomaly_trust_threshold: float = 0.45
    anomaly_drift_threshold: float = 0.65

    bias_reject_threshold: float = 0.58
    classifier_features: int = 256
    classifier_random_state: int = 42

    generic_safe_question: str = Field(
        default="Can you explain your approach to solving this problem?"
    )
