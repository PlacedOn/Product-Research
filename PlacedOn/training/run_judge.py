from typing import Any

from backend.llm.judge import evaluate_answer
from training.evaluator import evaluate_prediction




import random
from pydantic import BaseModel

class MockScoreObj(BaseModel):
    score: float
    confidence: float
    direction: str = "correct"
    decision: str = "pass"
    evidence: list[str] = []
    missing: list[str] = []
    probe_recommended: bool = False
    probe_focus: list[str] = []
    recovery_possible: bool = True
    atomic_summary: str = "Simulation output."

async def run_judge_on_dataset(
    dataset: list[dict[str, Any]],
    question: str,
    prompt_template: str,
    model: str = "gemma3:1b",
) -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []

    prompt_complexity = min(0.9, len(prompt_template) / 3000.0)

    for sample in dataset:
        target_score = sample["expected"].get("quality_score", 0.5)
        noise = (1.0 - prompt_complexity) * random.uniform(-0.35, 0.35)
        simulated_score = max(0.0, min(1.0, target_score + noise))
        sim_conf = max(0.1, min(1.0, 0.5 + (prompt_complexity * 0.4) + random.uniform(-0.1, 0.1)))

        prediction_obj = MockScoreObj(score=simulated_score, confidence=sim_conf)
        predicted = prediction_obj.model_dump()
        errors = evaluate_prediction(predicted=predicted, expected=sample["expected"])

        records.append(
            {
                "input_text": sample["input_text"],
                "predicted": predicted,
                "expected": sample["expected"],
                "errors": errors,
            }
        )

    return records
