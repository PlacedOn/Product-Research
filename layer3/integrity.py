from layer3.config import Layer3Config
from layer3.models import IntegrityInput, IntegrityOutput


def _cosine_distance(left: list[float], right: list[float]) -> float:
    if not left or not right:
        return 0.0

    max_len = max(len(left), len(right))
    l = left + [0.0] * (max_len - len(left))
    r = right + [0.0] * (max_len - len(right))

    dot = sum(a * b for a, b in zip(l, r))
    norm_l = sum(a * a for a in l) ** 0.5
    norm_r = sum(b * b for b in r) ** 0.5
    if norm_l == 0.0 or norm_r == 0.0:
        return 0.0

    cosine = dot / (norm_l * norm_r)
    cosine = max(-1.0, min(cosine, 1.0))
    return 1.0 - ((cosine + 1.0) / 2.0)


class BehavioralIntegrityEngine:
    def __init__(self, config: Layer3Config | None = None) -> None:
        self._config = config or Layer3Config()

    async def evaluate(self, data: IntegrityInput) -> IntegrityOutput:
        embedding_drift = self._embedding_drift(data.embeddings)
        combined_drift = (embedding_drift + data.drift_score) / 2.0

        stability = 1.0 - combined_drift
        trust_score = (
            (self._config.trust_weight_consistency * data.consistency_score)
            + (self._config.trust_weight_stability * stability)
            + (self._config.trust_weight_confidence * data.confidence_signal)
        )
        trust_score = round(max(0.0, min(trust_score, 1.0)), 4)

        anomaly_flag = (
            trust_score < self._config.anomaly_trust_threshold
            or combined_drift > self._config.anomaly_drift_threshold
        )

        return IntegrityOutput(
            trust_score=trust_score,
            anomaly_flag=anomaly_flag,
        )

    def _embedding_drift(self, embeddings: list[list[float]]) -> float:
        if len(embeddings) < 2:
            return 0.0

        distances = [
            _cosine_distance(embeddings[idx - 1], embeddings[idx])
            for idx in range(1, len(embeddings))
        ]
        return sum(distances) / len(distances)
