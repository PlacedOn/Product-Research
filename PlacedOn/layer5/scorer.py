import logging
import os

import numpy as np
import torch
from kan import KAN
from pydantic import BaseModel

LOGGER = logging.getLogger(__name__)


class ScoringResult(BaseModel):
    score: float
    confidence: float
    explanation: str

class ScoringEngine:
    def __init__(self, model_path: str = None):
        if model_path is None:
            # Default path relative to this file
            base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            model_path = os.path.join(base_path, "training", "basic_model.kan")
        
        self.model_path = model_path
        self.model = None
        self._load_model()

    def _load_model(self):
        """Loads the KAN model state from disk."""
        if not os.path.exists(self.model_path):
            LOGGER.warning("Model path %s not found. Scorer will remain uninitialized.", self.model_path)
            return

        try:
            # Width: 384 input features (SBERT) -> 16 splines -> 1 output score
            self.model = KAN(width=[384, 16, 1], grid=3, k=3)
            self.model.load_state_dict(self._safe_load_state_dict())
            self.model.eval()  # Set to evaluation mode
            LOGGER.info("Successfully loaded KAN model from %s", self.model_path)
        except Exception:  # noqa: BLE001
            LOGGER.exception("Error loading KAN model from %s", self.model_path)
            self.model = None

    def _safe_load_state_dict(self):
        return torch.load(
            self.model_path,
            map_location=torch.device("cpu"),
            weights_only=True,
        )

    def predict_detailed(self, embedding: list[float]) -> ScoringResult:
        """ Predicts a detailed result including explainability placeholders. """
        if self.model is None:
            return ScoringResult(score=0.5, confidence=0.0, explanation="Model not loaded")

        try:
            with torch.no_grad():
                input_tensor = torch.tensor([embedding], dtype=torch.float32)
                # KAN forward pass
                prediction = self.model(input_tensor)
                score = float(prediction.detach().numpy().flatten()[0])
                score = float(np.clip(score, 0.0, 1.0))
                
                # Derive confidence from spline stability (for now using variance-based mock logic)
                # In a real KAN we would look at the grid standard deviations
                confidence = 0.92 if score > 0.8 or score < 0.2 else 0.75
                
                explanation = "High semantic alignment with Senior Architect archetypes." if score > 0.8 else "Conceptual gaps identified in implementation depth."
                
                return ScoringResult(score=score, confidence=confidence, explanation=explanation)
        except Exception as exc:  # noqa: BLE001
            LOGGER.exception("Error during KAN prediction")
            return ScoringResult(score=0.5, confidence=0.0, explanation=f"Error: {exc}")

    def predict(self, embedding: list[float]) -> float:
        """ Backward compatible predict call. """
        result = self.predict_detailed(embedding)
        return result.score
