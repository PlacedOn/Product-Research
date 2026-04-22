"""Accelerated simulation room for trial-and-error training of the interview model."""

from __future__ import annotations

import argparse
import asyncio
import json
import pickle
import random
import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from statistics import mean

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from aot_layer.config import AoTConfig
from aot_layer.orchestrator import AoTOrchestrator
import backend.llm.generator as generator_module
import backend.llm.judge as judge_module
from layer2.embedding import embed_text
from layer3.bias_classifier import BiasEnforcer
from layer5.aggregator import AggregationEngine
from layer5.models import InterviewTurn, SkillTurnSignal
from simulation.candidate import (
    GroundTruthProfile,
    SyntheticCandidate,
    get_archetype_buzzword_king,
)
from simulation.env import InterviewEnv
from simulation.meta_learner import MetaLearner

SKILLS = ["caching", "concurrency", "api_design", "system_design"]
SCORE_MAP = {"correct": 1.0, "partial": 0.5, "wrong": 0.2}


@dataclass(frozen=True)
class RoundSample:
    features: list[float]
    target: float
    archetype: str
    pre_prediction: float
    pre_error: float
    mistake_count: int


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run an accelerated PlacedOn simulation room")
    parser.add_argument("--simulated-minutes", type=int, default=60)
    parser.add_argument("--interviews-per-minute", type=int, default=1)
    parser.add_argument("--rounds", type=int, default=6)
    parser.add_argument("--max-turns", type=int, default=4)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--log-path",
        default="training/simulation_room_log.jsonl",
        help="Per-interview log output path",
    )
    parser.add_argument(
        "--report-path",
        default="training/simulation_room_report.json",
        help="Summary report output path",
    )
    parser.add_argument(
        "--model-path",
        default="training/simulation_room_model.pkl",
        help="Trained model output path",
    )
    return parser.parse_args()


def _catalog() -> dict[str, GroundTruthProfile]:
    return {
        "buzzword_king": get_archetype_buzzword_king(),
        "balanced_operator": GroundTruthProfile(
            skills={
                "caching": 0.72,
                "concurrency": 0.68,
                "api_design": 0.74,
                "system_design": 0.66,
            },
            persona_score=0.72,
        ),
        "deep_specialist": GroundTruthProfile(
            skills={
                "caching": 0.9,
                "concurrency": 0.87,
                "api_design": 0.76,
                "system_design": 0.71,
            },
            persona_score=0.58,
        ),
        "junior_generalist": GroundTruthProfile(
            skills={
                "caching": 0.34,
                "concurrency": 0.41,
                "api_design": 0.47,
                "system_design": 0.36,
            },
            persona_score=0.62,
        ),
    }


def _extract_answer(prompt: str) -> str:
    match = re.search(r"Answer:\s*(.*)\Z", prompt, re.DOTALL)
    if not match:
        return ""
    return match.group(1).strip()


def _simulated_judge_call(prompt: str, *_args, **_kwargs) -> str:
    answer = _extract_answer(prompt)
    signals = judge_module._analyze_answer(answer)

    score = 0.18
    if bool(signals["has_explanation"]):
        score += 0.16
    if bool(signals["has_mechanism"]):
        score += 0.28
    if bool(signals["has_tradeoff"]):
        score += 0.14
    if bool(signals["has_example"]):
        score += 0.1
    if bool(signals["mentions_tool"]):
        score += 0.05
    if int(signals["token_count"]) >= 18:
        score += 0.08

    if bool(signals["very_short"]):
        score -= 0.18
    if bool(signals["keyword_only"]):
        score -= 0.16
    if bool(signals["vague"]):
        score -= 0.08

    score = max(0.05, min(score, 0.95))
    confidence = max(0.25, min(0.45 + (score * 0.5), 0.95))

    strengths: list[str] = []
    weaknesses: list[str] = []
    missing: list[str] = []

    if bool(signals["has_mechanism"]):
        strengths.append("Explains a concrete mechanism")
    if bool(signals["has_tradeoff"]):
        strengths.append("Acknowledges trade-offs")
    if bool(signals["has_explanation"]):
        strengths.append("Provides reasoning")

    if bool(signals["keyword_only"]):
        weaknesses.append("Keyword-heavy answer without enough mechanism")
        missing.append("Concrete mechanism")
    if bool(signals["vague"]):
        weaknesses.append("Needs more specificity")
        missing.append("Detailed example")
    if not bool(signals["has_tradeoff"]):
        missing.append("Trade-off analysis")

    payload = {
        "score": round(score, 3),
        "confidence": round(confidence, 3),
        "strengths": strengths[:3],
        "weaknesses": weaknesses[:3],
        "missing_concepts": missing[:3],
        "intent": "partial_understanding",
        "depth": "basic",
        "clarity": "okay",
        "atomic_summary": "Synthetic simulation judgment",
    }
    return json.dumps(payload)


def _simulated_generator_call(*_args, **_kwargs) -> str:
    # Return invalid JSON on purpose so backend.llm.generator immediately uses its local fallback templates.
    return "not-json"


def _target_score(profile: GroundTruthProfile) -> float:
    skill_mean = mean(profile.skills.values())
    return round((0.9 * skill_mean) + (0.1 * profile.persona_score), 4)


def _normalize_weights(weights: dict[str, float]) -> dict[str, float]:
    total = sum(weights.values()) or 1.0
    return {name: round(value / total, 6) for name, value in weights.items()}


def _update_sampling_weights(
    current_weights: dict[str, float],
    errors_by_archetype: dict[str, list[float]],
    mistake_counts: dict[str, int],
) -> dict[str, float]:
    updated: dict[str, float] = {}
    for archetype, weight in current_weights.items():
        avg_error = mean(errors_by_archetype.get(archetype, [0.2]))
        mistake_boost = min(mistake_counts.get(archetype, 0) * 0.05, 0.25)
        updated[archetype] = max(0.1, weight * (1.0 + avg_error + mistake_boost))
    return _normalize_weights(updated)


async def _aggregate_result(
    result,
    aggregator: AggregationEngine,
) -> list[float]:
    turns: list[InterviewTurn] = []
    for log in result.logs:
        embedding = await embed_text(log.answer)
        signal = SkillTurnSignal(
            score=SCORE_MAP.get(log.judge.direction, 0.5),
            confidence=log.judge.confidence,
            evidence=[log.answer[:180]],
        )
        turns.append(
            InterviewTurn(
                turn_index=log.turn,
                confidence=log.judge.confidence,
                embedding=embedding,
                skills={log.skill: signal},
            )
        )

    aggregate = await aggregator.aggregate(turns)
    return aggregate.embedding


def _fit_model(samples: list[RoundSample], seed: int) -> tuple[RandomForestRegressor, float]:
    X = np.array([sample.features for sample in samples])
    y = np.array([sample.target for sample in samples])

    test_size = max(4, int(len(samples) * 0.25))
    if test_size >= len(samples):
        test_size = max(1, len(samples) // 3)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=seed,
    )

    model = RandomForestRegressor(
        n_estimators=160,
        max_depth=12,
        min_samples_leaf=2,
        random_state=seed,
    )
    model.fit(X_train, y_train)
    mae = mean_absolute_error(y_test, model.predict(X_test))
    return model, float(mae)


async def run_simulation_room(
    simulated_minutes: int,
    interviews_per_minute: int,
    rounds: int,
    max_turns: int,
    seed: int,
    log_path: str,
    report_path: str,
    model_path: str,
) -> dict[str, object]:
    random.seed(seed)
    np.random.seed(seed)

    judge_module.call_ollama = _simulated_judge_call
    generator_module.call_ollama = _simulated_generator_call

    total_interviews = max(1, simulated_minutes * interviews_per_minute)
    rounds = max(1, min(rounds, total_interviews))
    interviews_per_round = total_interviews // rounds
    remainder = total_interviews % rounds

    orchestrator = AoTOrchestrator(
        config=AoTConfig(skills=SKILLS, total_turn_limit=max_turns, max_retries_per_skill=1)
    )
    aggregator = AggregationEngine()
    catalog = _catalog()
    sampling_weights = _normalize_weights({name: 1.0 for name in catalog})
    all_samples: list[RoundSample] = []
    round_reports: list[dict[str, object]] = []
    all_patch_recommendations: list[str] = []

    log_output = Path(log_path)
    log_output.parent.mkdir(parents=True, exist_ok=True)
    log_output.write_text("", encoding="utf-8")

    model: RandomForestRegressor | None = None

    for round_idx in range(1, rounds + 1):
        round_size = interviews_per_round + (1 if round_idx <= remainder else 0)
        batch_samples: list[RoundSample] = []
        errors_by_archetype: dict[str, list[float]] = defaultdict(list)
        mistake_counts: dict[str, int] = defaultdict(int)
        batch_mistakes: list[dict[str, object]] = []

        for interview_idx in range(1, round_size + 1):
            archetype_name = random.choices(
                population=list(sampling_weights.keys()),
                weights=list(sampling_weights.values()),
                k=1,
            )[0]
            profile = catalog[archetype_name].model_copy(deep=True)
            candidate = SyntheticCandidate(profile)
            env = InterviewEnv(orchestrator=orchestrator, candidate=candidate)
            result = await env.run_session(max_turns=max_turns)

            features = await _aggregate_result(result, aggregator)
            target = _target_score(profile)
            pre_prediction = float(model.predict([features])[0]) if model is not None else 0.5
            pre_error = abs(pre_prediction - target)

            meta_learner = MetaLearner(profile)
            mistakes = meta_learner.analyze_mistakes(result)
            patch_note = meta_learner.propose_patch(mistakes)
            if patch_note != "No obvious mistakes detected. No patch needed.":
                all_patch_recommendations.append(patch_note.strip())

            batch_mistakes.extend(
                {
                    "round": round_idx,
                    "interview": interview_idx,
                    "archetype": archetype_name,
                    **mistake,
                }
                for mistake in mistakes
            )
            mistake_counts[archetype_name] += len(mistakes)
            errors_by_archetype[archetype_name].append(pre_error)

            sample = RoundSample(
                features=features,
                target=target,
                archetype=archetype_name,
                pre_prediction=round(pre_prediction, 4),
                pre_error=round(pre_error, 4),
                mistake_count=len(mistakes),
            )
            batch_samples.append(sample)
            all_samples.append(sample)

            with log_output.open("a", encoding="utf-8") as handle:
                handle.write(
                    json.dumps(
                        {
                            "round": round_idx,
                            "interview": interview_idx,
                            "archetype": archetype_name,
                            "target_score": target,
                            "pre_prediction": sample.pre_prediction,
                            "pre_error": sample.pre_error,
                            "mistake_count": sample.mistake_count,
                        }
                    )
                    + "\n"
                )

        batch_pre_mae = mean(sample.pre_error for sample in batch_samples)
        holdout_mae = None
        if len(all_samples) >= 8:
            model, holdout_mae = _fit_model(all_samples, seed + round_idx)

        sampling_weights = _update_sampling_weights(
            sampling_weights,
            errors_by_archetype,
            mistake_counts,
        )

        round_reports.append(
            {
                "round": round_idx,
                "interviews": round_size,
                "batch_pre_train_mae": round(batch_pre_mae, 4),
                "holdout_mae": round(holdout_mae, 4) if holdout_mae is not None else None,
                "sampling_weights": sampling_weights,
                "mistake_count": len(batch_mistakes),
                "archetype_error": {
                    name: round(mean(values), 4) for name, values in errors_by_archetype.items()
                },
            }
        )

        if holdout_mae is None:
            print(f"[round {round_idx}/{rounds}] interviews={round_size} pre_mae={batch_pre_mae:.4f}")
        else:
            print(
                f"[round {round_idx}/{rounds}] interviews={round_size} "
                f"pre_mae={batch_pre_mae:.4f} holdout_mae={holdout_mae:.4f}"
            )

    if model is None:
        model, _ = _fit_model(all_samples, seed)

    model_output = Path(model_path)
    model_output.parent.mkdir(parents=True, exist_ok=True)
    with model_output.open("wb") as handle:
        pickle.dump(model, handle)

    report = {
        "config": {
            "simulated_minutes": simulated_minutes,
            "interviews_per_minute": interviews_per_minute,
            "total_interviews": total_interviews,
            "rounds": rounds,
            "max_turns": max_turns,
            "seed": seed,
        },
        "summary": {
            "final_holdout_mae": round(
                next(
                    (
                        report["holdout_mae"]
                        for report in reversed(round_reports)
                        if report["holdout_mae"] is not None
                    ),
                    0.0,
                ),
                4,
            ),
            "initial_pre_train_mae": round(round_reports[0]["batch_pre_train_mae"], 4),
            "final_pre_train_mae": round(round_reports[-1]["batch_pre_train_mae"], 4),
            "patch_recommendations": list(dict.fromkeys(all_patch_recommendations))[:5],
        },
        "rounds": round_reports,
        "artifacts": {
            "model_path": str(model_output),
            "log_path": str(log_output),
        },
    }

    report_output = Path(report_path)
    report_output.parent.mkdir(parents=True, exist_ok=True)
    report_output.write_text(json.dumps(report, indent=2), encoding="utf-8")

    return report


def main() -> None:
    args = parse_args()
    report = asyncio.run(
        run_simulation_room(
            simulated_minutes=args.simulated_minutes,
            interviews_per_minute=args.interviews_per_minute,
            rounds=args.rounds,
            max_turns=args.max_turns,
            seed=args.seed,
            log_path=args.log_path,
            report_path=args.report_path,
            model_path=args.model_path,
        )
    )
    print(json.dumps(report["summary"], indent=2))
    print(f"report: {args.report_path}")
    print(f"model: {args.model_path}")


if __name__ == "__main__":
    main()
