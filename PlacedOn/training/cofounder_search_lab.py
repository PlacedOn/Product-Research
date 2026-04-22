"""Multi-vector co-founder search lab for the thinking model.

The environment models a CEO ("HRX") searching for the right co-founder hidden
across different startup problem spaces. The AoT thinking model must interview
candidates, traverse different problem vectors, and identify the strongest
co-founder fit. A timed parameter sweep tunes the thinking loop without
coupling unfinished experiments into the production brain path.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import random
import time
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from statistics import mean
from typing import Any

import backend.llm.generator as generator_module
import backend.llm.judge as judge_module
from aot_layer.config import AoTConfig
from aot_layer.orchestrator import AoTOrchestrator
from aot_layer.models import OrchestrationResult, StartInput
from training.thinking_model_sandbox import _sandbox_generator_call, _sandbox_judge_call

SKILLS = [
    "block_6_leadership",
    "block_8_ownership",
    "block_6_social",
    "block_10_calibration",
    "system_design",
    "backend",
]

PSYCHOMETRIC_SKILLS = [
    "block_6_leadership",
    "block_8_ownership",
    "block_6_social",
    "block_10_calibration",
]

SEARCH_SPACE: dict[str, tuple[Any, ...]] = {
    "max_consecutive_per_skill": (2, 3),
    "max_probes_per_skill": (1, 2, 3),
    "max_retries_per_skill": (1, 2),
    "max_turns_per_skill": (3, 4, 5),
    "total_turn_limit": (6, 8, 10),
    "target_sigma2": (0.14, 0.18, 0.22, 0.26),
    "process_noise_q": (0.002, 0.005, 0.008),
    "measurement_noise_r_base": (0.14, 0.20, 0.26),
    "strategic_probe_score_floor": (0.45, 0.52, 0.60),
    "strategic_probe_score_ceiling": (0.72, 0.78, 0.84),
    "strategic_probe_missing_threshold": (1, 2),
}


@dataclass(frozen=True)
class VentureNeed:
    name: str
    stage: str
    hidden_location: str
    target_vector: dict[str, float]
    vector_prompts: dict[str, str]


@dataclass(frozen=True)
class CandidateProfile:
    name: str
    archetype: str
    location: str
    persona_polish: float
    curiosity: float
    integrity: float
    traits: dict[str, float]

    def answer(self, skill: str, mode: str, venture: VentureNeed) -> str:
        score = self._effective_score(skill, mode)
        challenge = venture.vector_prompts.get(skill, venture.hidden_location)
        if skill in PSYCHOMETRIC_SKILLS:
            return self._behavioral_answer(skill=skill, score=score, mode=mode, challenge=challenge)
        return self._technical_answer(skill=skill, score=score, mode=mode, challenge=challenge)

    def _effective_score(self, skill: str, mode: str) -> float:
        base = self.traits.get(skill, 0.5)
        if mode == "probe":
            base += 0.10 + (0.04 * self.curiosity)
        elif mode == "retry":
            base += 0.07 + (0.03 * self.integrity)
        return max(0.0, min(base, 1.0))

    def _behavioral_answer(self, skill: str, score: float, mode: str, challenge: str) -> str:
        if score >= 0.78:
            if skill == "block_6_leadership":
                return (
                    f"When {challenge}, I created clarity by naming the hard trade-off, assigning owners, "
                    "and keeping the team aligned around one operating plan. I changed the sequence of work "
                    "once new information appeared, because speed mattered less than preserving trust."
                )
            if skill == "block_8_ownership":
                return (
                    f"In {challenge}, I treated the outcome as mine. I surfaced risk early, took accountability "
                    "for the miss, and stayed with the fix until the operating metric recovered."
                )
            if skill == "block_6_social":
                return (
                    f"During {challenge}, I listened to both sides before pushing a decision. That helped me align "
                    "strong personalities without pretending the conflict did not exist."
                )
            return (
                f"In {challenge}, I stated my uncertainty, named the assumptions I was making, and updated the plan "
                "once reality contradicted my first view."
            )

        if score >= 0.52:
            if mode in {"probe", "retry"}:
                return (
                    f"I handled {challenge} by slowing the team down just enough to clarify the risk, then I aligned "
                    "people on a narrower plan and followed through on the next step."
                )
            if self.persona_polish >= 0.75:
                return f"I bring calm leadership and strong ownership during {challenge}, while keeping everyone mission aligned."
            return f"I tried to keep the team together during {challenge} and move the work forward."

        if self.persona_polish >= 0.7:
            return f"I am highly founder-minded in {challenge} and always focus on leadership, execution, and big-picture excellence."

        if self.integrity >= 0.6 and mode == "retry":
            return f"I do not fully know the right answer for {challenge}, but I would ask for clearer constraints before committing."

        return f"I would try my best during {challenge} and stay positive."

    def _technical_answer(self, skill: str, score: float, mode: str, challenge: str) -> str:
        if score >= 0.78:
            if skill == "system_design":
                return (
                    f"For {challenge}, I would separate the write path from the read path, define the failure domain first, "
                    "and use queues plus graceful degradation so one hot dependency does not take the entire company down."
                )
            return (
                f"For {challenge}, I would make the backend idempotent, bound retries with jitter, and add telemetry around "
                "latency and failure modes so we can recover without guessing."
            )

        if score >= 0.52:
            if mode in {"probe", "retry"}:
                return (
                    f"For {challenge}, I would start with the bottleneck, reduce blast radius, and add clearer operational guardrails "
                    "before scaling traffic again."
                )
            if self.persona_polish >= 0.75:
                return f"I focus on scalable architecture, resilience, and platform excellence for {challenge}."
            return f"I would build a reliable system for {challenge} and keep improving it."

        if self.persona_polish >= 0.7:
            return f"I would leverage best practices and modern architecture to solve {challenge}."

        if self.integrity >= 0.6 and mode == "retry":
            return f"I would need more constraints for {challenge}, but I would start by identifying the single riskiest dependency."

        return f"I am not sure how I would solve {challenge}."


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the timed co-founder search lab")
    parser.add_argument("--runtime-seconds", type=int, default=600)
    parser.add_argument("--episodes-per-trial", type=int, default=4)
    parser.add_argument("--max-turns", type=int, default=6)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--report-path",
        default="training/reports/cofounder_search_lab_report.json",
        help="Path for the JSON report",
    )
    parser.add_argument(
        "--summary-path",
        default="training/reports/cofounder_search_lab_summary.md",
        help="Path for the markdown summary",
    )
    parser.add_argument(
        "--config-path",
        default="training/reports/cofounder_search_best_config.json",
        help="Path for the best config JSON",
    )
    return parser.parse_args()


def _ventures() -> tuple[VentureNeed, ...]:
    return (
        VentureNeed(
            name="HRX Seed Maze",
            stage="seed",
            hidden_location="the product war room",
            target_vector={
                "block_6_leadership": 0.84,
                "block_8_ownership": 0.92,
                "block_6_social": 0.78,
                "block_10_calibration": 0.80,
                "system_design": 0.75,
                "backend": 0.72,
            },
            vector_prompts={
                "block_6_leadership": "the CEO had to calm a founder-team conflict the night before launch",
                "block_8_ownership": "runway dropped to five months and the hiring funnel broke",
                "block_6_social": "a design lead and engineering lead disagreed over product scope",
                "block_10_calibration": "customer discovery invalidated the original roadmap",
                "system_design": "the interview graph service melted during a demo day spike",
                "backend": "the ingestion backend duplicated events under retry pressure",
            },
        ),
        VentureNeed(
            name="HRX Enterprise Trust",
            stage="enterprise",
            hidden_location="the compliance bunker",
            target_vector={
                "block_6_leadership": 0.76,
                "block_8_ownership": 0.88,
                "block_6_social": 0.82,
                "block_10_calibration": 0.90,
                "system_design": 0.70,
                "backend": 0.66,
            },
            vector_prompts={
                "block_6_leadership": "a pilot customer escalated a fairness concern to the board",
                "block_8_ownership": "the founder team had to own a bias incident in public",
                "block_6_social": "legal, product, and engineering pulled in different directions",
                "block_10_calibration": "the team had incomplete evidence about model safety",
                "system_design": "enterprise tenants needed stricter isolation and auditability",
                "backend": "privacy-sensitive exports required safer backend controls",
            },
        ),
        VentureNeed(
            name="HRX Infra Meltdown",
            stage="growth",
            hidden_location="the infra bunker",
            target_vector={
                "block_6_leadership": 0.72,
                "block_8_ownership": 0.86,
                "block_6_social": 0.68,
                "block_10_calibration": 0.74,
                "system_design": 0.92,
                "backend": 0.88,
            },
            vector_prompts={
                "block_6_leadership": "on-call fatigue was triggering blame and burnout",
                "block_8_ownership": "the CEO needed someone to take the incident personally without panic",
                "block_6_social": "infra and product were fighting over who caused the outage",
                "block_10_calibration": "the root cause was unclear during the first 30 minutes",
                "system_design": "traffic spiked 20x and one dependency became the single point of failure",
                "backend": "websocket state recovery broke under duplicate retries",
            },
        ),
        VentureNeed(
            name="HRX Culture Friction",
            stage="team-reset",
            hidden_location="the founder offsite cabin",
            target_vector={
                "block_6_leadership": 0.90,
                "block_8_ownership": 0.82,
                "block_6_social": 0.91,
                "block_10_calibration": 0.84,
                "system_design": 0.58,
                "backend": 0.54,
            },
            vector_prompts={
                "block_6_leadership": "the company needed a leader who could disagree without breaking the team",
                "block_8_ownership": "a missed quarter forced the founders to reset standards",
                "block_6_social": "two senior hires had opposite ideas about culture and pace",
                "block_10_calibration": "the CEO needed a co-founder who could admit uncertainty fast",
                "system_design": "product scope had to shrink without collapsing the roadmap",
                "backend": "the team needed enough technical judgment to guide architects without pretending to be the deepest engineer",
            },
        ),
    )


def _candidate_catalog() -> tuple[CandidateProfile, ...]:
    return (
        CandidateProfile(
            name="Aarav",
            archetype="anti_fragile_builder",
            location="the infra bunker",
            persona_polish=0.58,
            curiosity=0.72,
            integrity=0.82,
            traits={
                "block_6_leadership": 0.73,
                "block_8_ownership": 0.92,
                "block_6_social": 0.67,
                "block_10_calibration": 0.79,
                "system_design": 0.90,
                "backend": 0.88,
            },
        ),
        CandidateProfile(
            name="Mira",
            archetype="mission_aligned_operator",
            location="the product war room",
            persona_polish=0.70,
            curiosity=0.78,
            integrity=0.88,
            traits={
                "block_6_leadership": 0.89,
                "block_8_ownership": 0.86,
                "block_6_social": 0.90,
                "block_10_calibration": 0.84,
                "system_design": 0.66,
                "backend": 0.59,
            },
        ),
        CandidateProfile(
            name="Kabir",
            archetype="charismatic_buzzword_seller",
            location="the growth stage",
            persona_polish=0.93,
            curiosity=0.46,
            integrity=0.42,
            traits={
                "block_6_leadership": 0.58,
                "block_8_ownership": 0.44,
                "block_6_social": 0.63,
                "block_10_calibration": 0.31,
                "system_design": 0.37,
                "backend": 0.35,
            },
        ),
        CandidateProfile(
            name="Naina",
            archetype="enterprise_trust_builder",
            location="the compliance bunker",
            persona_polish=0.76,
            curiosity=0.69,
            integrity=0.93,
            traits={
                "block_6_leadership": 0.78,
                "block_8_ownership": 0.84,
                "block_6_social": 0.83,
                "block_10_calibration": 0.94,
                "system_design": 0.62,
                "backend": 0.58,
            },
        ),
        CandidateProfile(
            name="Dev",
            archetype="mercenary_cto",
            location="the isolated lab",
            persona_polish=0.61,
            curiosity=0.52,
            integrity=0.57,
            traits={
                "block_6_leadership": 0.42,
                "block_8_ownership": 0.67,
                "block_6_social": 0.34,
                "block_10_calibration": 0.48,
                "system_design": 0.89,
                "backend": 0.91,
            },
        ),
        CandidateProfile(
            name="Sara",
            archetype="adaptive_generalist",
            location="the founder offsite cabin",
            persona_polish=0.67,
            curiosity=0.81,
            integrity=0.78,
            traits={
                "block_6_leadership": 0.74,
                "block_8_ownership": 0.77,
                "block_6_social": 0.75,
                "block_10_calibration": 0.81,
                "system_design": 0.71,
                "backend": 0.69,
            },
        ),
    )


def _weighted_fit(vector: dict[str, float], target: dict[str, float]) -> float:
    weighted_error = 0.0
    total_weight = 0.0
    for skill, desired in target.items():
        weight = max(desired, 0.05)
        total_weight += weight
        weighted_error += abs(vector.get(skill, 0.5) - desired) * weight
    if total_weight == 0.0:
        return 0.0
    return max(0.0, min(1.0 - (weighted_error / total_weight), 1.0))


def _psychometric_mae(vector: dict[str, float], truth: dict[str, float]) -> float:
    return mean(abs(vector.get(skill, 0.5) - truth[skill]) for skill in PSYCHOMETRIC_SKILLS)


def _solve_rate(vector: dict[str, float], truth: dict[str, float]) -> float:
    solved = sum(1 for skill in SKILLS if abs(vector.get(skill, 0.5) - truth[skill]) <= 0.18)
    return solved / len(SKILLS)


def _candidate_summary(candidate: CandidateProfile, venture: VentureNeed) -> dict[str, Any]:
    true_fit = _weighted_fit(candidate.traits, venture.target_vector)
    return {
        "name": candidate.name,
        "archetype": candidate.archetype,
        "location": candidate.location,
        "true_fit": round(true_fit, 4),
    }


async def _interview_candidate(
    candidate: CandidateProfile,
    venture: VentureNeed,
    config: AoTConfig,
    max_turns: int,
) -> dict[str, Any]:
    orchestrator = AoTOrchestrator(config=config)

    async def answer_provider(_turn: int, _question: str, skill: str, mode: str) -> str:
        return candidate.answer(skill=skill, mode=mode, venture=venture)

    result = await orchestrator.run(
        start_input=StartInput(
            skill_vector=[0.45] * len(SKILLS),
            sigma2=[0.88] * len(SKILLS),
            past_attempts_per_skill={skill: 0 for skill in SKILLS},
        ),
        answer_provider=answer_provider,
        max_turns=max_turns,
    )

    estimated_vector = result.final_state.skill_vector
    estimated_fit = _weighted_fit(estimated_vector, venture.target_vector)
    psycho_mae = _psychometric_mae(estimated_vector, candidate.traits)
    solve_rate = _solve_rate(estimated_vector, candidate.traits)
    actions = Counter(log.controller_action for log in result.logs)

    return {
        "candidate": candidate,
        "result": result,
        "estimated_fit": estimated_fit,
        "true_fit": _weighted_fit(candidate.traits, venture.target_vector),
        "psychometric_mae": psycho_mae,
        "solve_rate": solve_rate,
        "turns": len(result.logs),
        "actions": dict(actions),
        "estimated_vector": estimated_vector,
    }


def _trial_reward(
    selection_accuracy: float,
    selected_true_fit: float,
    psychometric_mae: float,
    solve_rate: float,
    efficiency: float,
) -> float:
    reward = (
        (0.45 * selection_accuracy)
        + (0.20 * selected_true_fit)
        + (0.15 * (1.0 - psychometric_mae))
        + (0.12 * solve_rate)
        + (0.08 * efficiency)
    )
    return max(0.0, min(round(reward, 4), 1.0))


def _base_search_config() -> dict[str, Any]:
    return {name: values[0] for name, values in SEARCH_SPACE.items()}


def _coverage_configs() -> list[dict[str, Any]]:
    base = _base_search_config()
    configs: list[dict[str, Any]] = [dict(base)]
    for name, values in SEARCH_SPACE.items():
        for value in values[1:]:
            candidate = dict(base)
            candidate[name] = value
            if candidate not in configs:
                configs.append(candidate)
    return configs


def _mutate_config(rng: random.Random, elite: dict[str, Any] | None) -> dict[str, Any]:
    if elite is None:
        return {name: rng.choice(values) for name, values in SEARCH_SPACE.items()}

    candidate = dict(elite)
    mutation_count = rng.randint(1, 3)
    names = rng.sample(list(SEARCH_SPACE.keys()), k=mutation_count)
    for name in names:
        values = SEARCH_SPACE[name]
        current = candidate[name]
        index = values.index(current)
        neighbors = [current]
        if index > 0:
            neighbors.append(values[index - 1])
        if index < len(values) - 1:
            neighbors.append(values[index + 1])
        candidate[name] = rng.choice(neighbors)
    return candidate


def _config_key(config: dict[str, Any]) -> tuple[tuple[str, Any], ...]:
    return tuple(sorted(config.items()))


def _build_config(config_values: dict[str, Any]) -> AoTConfig:
    return AoTConfig(skills=SKILLS, **config_values)


async def _evaluate_trial(
    config_values: dict[str, Any],
    ventures: tuple[VentureNeed, ...],
    catalog: tuple[CandidateProfile, ...],
    episodes_per_trial: int,
    max_turns: int,
    rng: random.Random,
) -> dict[str, Any]:
    config = _build_config(config_values)
    episode_reports: list[dict[str, Any]] = []
    venture_breakdown: dict[str, list[float]] = defaultdict(list)
    hardest_vectors: dict[str, list[float]] = defaultdict(list)

    for _ in range(episodes_per_trial):
        venture = rng.choice(ventures)
        roster = rng.sample(list(catalog), k=4)
        interviews = [
            await _interview_candidate(candidate=candidate, venture=venture, config=config, max_turns=max_turns)
            for candidate in roster
        ]
        selected = max(interviews, key=lambda item: item["estimated_fit"])
        hidden = max(interviews, key=lambda item: item["true_fit"])
        accuracy = 1.0 if selected["candidate"].name == hidden["candidate"].name else 0.0
        avg_mae = mean(item["psychometric_mae"] for item in interviews)
        avg_solve = mean(item["solve_rate"] for item in interviews)
        avg_turns = mean(item["turns"] for item in interviews)
        efficiency = max(0.0, min(1.0 - ((avg_turns - 3.0) / max(max_turns - 3.0, 1.0)), 1.0))
        reward = _trial_reward(
            selection_accuracy=accuracy,
            selected_true_fit=selected["true_fit"],
            psychometric_mae=avg_mae,
            solve_rate=avg_solve,
            efficiency=efficiency,
        )

        venture_breakdown[venture.name].append(reward)
        for skill in SKILLS:
            hardest_vectors[skill].append(abs(selected["estimated_vector"].get(skill, 0.5) - hidden["candidate"].traits[skill]))

        episode_reports.append(
            {
                "venture": venture.name,
                "stage": venture.stage,
                "hidden_location": venture.hidden_location,
                "selected_candidate": selected["candidate"].name,
                "selected_location": selected["candidate"].location,
                "hidden_cofounder": hidden["candidate"].name,
                "hidden_candidate_location": hidden["candidate"].location,
                "selection_accuracy": accuracy,
                "selected_true_fit": round(selected["true_fit"], 4),
                "selected_estimated_fit": round(selected["estimated_fit"], 4),
                "avg_psychometric_mae": round(avg_mae, 4),
                "avg_solve_rate": round(avg_solve, 4),
                "avg_turns": round(avg_turns, 4),
                "reward": reward,
                "roster": [_candidate_summary(item["candidate"], venture) for item in interviews],
                "action_mix": dict(sum((Counter(item["actions"]) for item in interviews), Counter())),
            }
        )

    selection_accuracy = mean(item["selection_accuracy"] for item in episode_reports)
    avg_selected_true_fit = mean(item["selected_true_fit"] for item in episode_reports)
    avg_psychometric_mae = mean(item["avg_psychometric_mae"] for item in episode_reports)
    avg_solve_rate = mean(item["avg_solve_rate"] for item in episode_reports)
    avg_turns = mean(item["avg_turns"] for item in episode_reports)
    efficiency = max(0.0, min(1.0 - ((avg_turns - 3.0) / max(max_turns - 3.0, 1.0)), 1.0))
    avg_reward = _trial_reward(
        selection_accuracy=selection_accuracy,
        selected_true_fit=avg_selected_true_fit,
        psychometric_mae=avg_psychometric_mae,
        solve_rate=avg_solve_rate,
        efficiency=efficiency,
    )

    hardest_vector_rank = sorted(
        (
            {"skill": skill, "mean_error": round(mean(values), 4)}
            for skill, values in hardest_vectors.items()
        ),
        key=lambda item: item["mean_error"],
        reverse=True,
    )

    return {
        "config": config_values,
        "selection_accuracy": round(selection_accuracy, 4),
        "avg_selected_true_fit": round(avg_selected_true_fit, 4),
        "avg_psychometric_mae": round(avg_psychometric_mae, 4),
        "avg_solve_rate": round(avg_solve_rate, 4),
        "avg_turns": round(avg_turns, 4),
        "avg_reward": round(avg_reward, 4),
        "venture_reward": {
            name: round(mean(values), 4) for name, values in venture_breakdown.items()
        },
        "hardest_vectors": hardest_vector_rank[:3],
        "episodes": episode_reports,
    }


def _coverage_report(trials: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    coverage: dict[str, dict[str, Any]] = {}
    for name, values in SEARCH_SPACE.items():
        seen = sorted({trial["config"][name] for trial in trials}, key=lambda value: values.index(value))
        coverage[name] = {
            "seen_values": seen,
            "tested_option_count": len(seen),
            "total_option_count": len(values),
        }
    return coverage


def _write_summary(
    report: dict[str, Any],
    summary_path: str,
    config_path: str,
) -> None:
    best = report["best_trial"]
    lines = [
        "# Co-Founder Search Lab",
        "",
        "This report captures the timed founder-search simulation for the thinking model.",
        "",
        "## Key Result",
        "",
        f"- Runtime seconds: `{report['config']['runtime_seconds']}`",
        f"- Trials completed: `{report['summary']['trial_count']}`",
        f"- Best average reward: `{best['avg_reward']}`",
        f"- Best selection accuracy: `{best['selection_accuracy']}`",
        f"- Best psychometric MAE: `{best['avg_psychometric_mae']}`",
        f"- Best solve rate: `{best['avg_solve_rate']}`",
        "",
        "## Best Config",
        "",
        "```json",
        json.dumps(best["config"], indent=2),
        "```",
        "",
        f"Saved config artifact: `{config_path}`",
        "",
        "## Hardest Vectors",
        "",
    ]
    for item in best["hardest_vectors"]:
        lines.append(f"- `{item['skill']}` mean error `{item['mean_error']}`")

    lines.extend(
        [
            "",
            "## CTO Decision",
            "",
            "- Keep the production brain stable and use this lab as the tuning surface for the thinking model.",
            "- Promote only configs that improve co-founder selection accuracy and psychometric MAE together.",
            "- Focus the next iteration on the hardest vectors rather than chasing raw reward alone.",
            "",
            "## CPO Decision",
            "",
            "- Treat the hidden co-founder search as a founder-fit evaluation workflow, not a generic interview loop.",
            "- Preserve evidence-rich probing on leadership, ownership, calibration, and trust before final recommendation.",
            "",
            "## AI / ML Decision",
            "",
            "- Continue timed parameter sweeps across uncertainty, probe, and retry parameters.",
            "- Use scenario families with different startup stresses so the model does not overfit one founder archetype.",
        ]
    )

    output = Path(summary_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(lines) + "\n", encoding="utf-8")


async def run_cofounder_search_lab(
    runtime_seconds: int,
    episodes_per_trial: int,
    max_turns: int,
    seed: int,
    report_path: str,
    summary_path: str,
    config_path: str,
) -> dict[str, Any]:
    # Deterministic pseudo-randomness is intentional here for repeatable training runs.
    rng = random.Random(seed)  # nosec B311
    ventures = _ventures()
    catalog = _candidate_catalog()
    start = time.monotonic()
    deadline = start + runtime_seconds

    original_judge_call = judge_module.call_ollama
    original_generator_call = generator_module.call_ollama
    judge_module.call_ollama = _sandbox_judge_call
    generator_module.call_ollama = _sandbox_generator_call

    trials: list[dict[str, Any]] = []
    best_trial: dict[str, Any] | None = None
    seeded_configs = _coverage_configs()
    last_print_bucket = -1

    try:
        while time.monotonic() < deadline:
            if seeded_configs:
                config_values = seeded_configs.pop(0)
            else:
                elite = best_trial["config"] if best_trial is not None else None
                config_values = _mutate_config(rng, elite)

            trial = await _evaluate_trial(
                config_values=config_values,
                ventures=ventures,
                catalog=catalog,
                episodes_per_trial=episodes_per_trial,
                max_turns=max_turns,
                rng=rng,
            )
            trials.append(trial)

            if best_trial is None or trial["avg_reward"] > best_trial["avg_reward"]:
                best_trial = trial

            elapsed = int(time.monotonic() - start)
            current_bucket = elapsed // 15
            if current_bucket != last_print_bucket:
                last_print_bucket = current_bucket
                print(
                    f"[cofounder-lab] elapsed={elapsed}s trials={len(trials)} "
                    f"best_reward={best_trial['avg_reward']:.4f} "
                    f"best_accuracy={best_trial['selection_accuracy']:.4f}"
                )

        if best_trial is None:
            raise RuntimeError("Co-founder search lab completed without any trials")

        top_trials = sorted(trials, key=lambda item: item["avg_reward"], reverse=True)[:5]
        report = {
            "config": {
                "runtime_seconds": runtime_seconds,
                "episodes_per_trial": episodes_per_trial,
                "max_turns": max_turns,
                "seed": seed,
                "skills": SKILLS,
            },
            "summary": {
                "trial_count": len(trials),
                "best_reward": best_trial["avg_reward"],
                "best_selection_accuracy": best_trial["selection_accuracy"],
                "best_psychometric_mae": best_trial["avg_psychometric_mae"],
                "best_solve_rate": best_trial["avg_solve_rate"],
            },
            "parameter_coverage": _coverage_report(trials),
            "best_trial": best_trial,
            "top_trials": top_trials,
        }

        report_output = Path(report_path)
        report_output.parent.mkdir(parents=True, exist_ok=True)
        report_output.write_text(json.dumps(report, indent=2), encoding="utf-8")

        config_output = Path(config_path)
        config_output.parent.mkdir(parents=True, exist_ok=True)
        config_output.write_text(json.dumps(best_trial["config"], indent=2), encoding="utf-8")

        _write_summary(report=report, summary_path=summary_path, config_path=config_path)
        return report
    finally:
        judge_module.call_ollama = original_judge_call
        generator_module.call_ollama = original_generator_call


def main() -> None:
    args = parse_args()
    report = asyncio.run(
        run_cofounder_search_lab(
            runtime_seconds=args.runtime_seconds,
            episodes_per_trial=args.episodes_per_trial,
            max_turns=args.max_turns,
            seed=args.seed,
            report_path=args.report_path,
            summary_path=args.summary_path,
            config_path=args.config_path,
        )
    )
    print(json.dumps(report["summary"], indent=2))
    print(f"report: {args.report_path}")
    print(f"summary: {args.summary_path}")
    print(f"config: {args.config_path}")


if __name__ == "__main__":
    main()
