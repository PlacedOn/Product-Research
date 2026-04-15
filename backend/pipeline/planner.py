from typing import Any

from backend.schemas.generator_schema import PlanOutput
from backend.pipeline.jd_parser import build_skill_profile


def _to_float(value: Any, default: float = 0.5) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _score_to_mode(score: float) -> tuple[str, str, str]:
    if score < 0.4:
        return "help", "easy", "supportive"
    if score <= 0.7:
        return "probe", "medium", "neutral"
    return "challenge", "hard", "challenging"


def _difficulty_from_depth(depth: str) -> str:
    if depth == "shallow":
        return "easy"
    if depth == "basic":
        return "medium"
    if depth == "good":
        return "medium"
    if depth == "strong":
        return "hard"
    return "medium"


def _pick_target_skill(context: dict[str, Any], fallback: str) -> str:
    interview_state = context.get("interview_state") or {}
    current_focus = str(interview_state.get("current_focus") or "").strip().lower()
    if current_focus:
        return current_focus

    covered = {str(skill).strip().lower() for skill in interview_state.get("covered_skills", [])}

    candidate = context.get("candidate") or {}
    for skill in candidate.get("skills", []):
        normalized = str(skill).strip().lower()
        if normalized and normalized not in covered:
            return normalized

    job = context.get("job") or {}
    for skill in job.get("required_skills", []):
        normalized = str(skill).strip().lower()
        if normalized and normalized not in covered:
            return normalized

    return fallback


def _skills_from_context(context: dict[str, Any]) -> list[str]:
    ordered_skills: list[str] = []

    candidate = context.get("candidate") or {}
    for skill in candidate.get("skills", []):
        normalized = str(skill).strip().lower()
        if normalized and normalized not in ordered_skills:
            ordered_skills.append(normalized)

    job = context.get("job") or {}
    for skill in job.get("required_skills", []):
        normalized = str(skill).strip().lower()
        if normalized and normalized not in ordered_skills:
            ordered_skills.append(normalized)

    for skill in job.get("preferred_skills", []):
        normalized = str(skill).strip().lower()
        if normalized and normalized not in ordered_skills:
            ordered_skills.append(normalized)

    return ordered_skills


def _pick_priority_skill(context: dict[str, Any], fallback: str) -> str:
    interview_state = context.get("interview_state") or {}
    skill_scores_raw = interview_state.get("skill_scores") or {}
    skill_scores = {
        str(skill).strip().lower(): _to_float(score, 0.0)
        for skill, score in skill_scores_raw.items()
        if str(skill).strip()
    }

    covered = {str(skill).strip().lower() for skill in interview_state.get("covered_skills", [])}
    job = context.get("job") or {}
    role = str(job.get("role") or "").strip().lower()
    jd_text = " ".join(
        [
            str(job.get("description") or ""),
            " ".join(str(skill) for skill in job.get("required_skills", [])),
            " ".join(str(skill) for skill in job.get("preferred_skills", [])),
        ]
    )
    skill_profile = build_skill_profile(jd_text=jd_text, role=role)

    available_skills = _skills_from_context(context)
    for profile_skill in skill_profile:
        if profile_skill not in available_skills:
            available_skills.append(profile_skill)

    if not available_skills:
        return fallback

    def _priority(skill: str) -> tuple[float, float]:
        weight = float(skill_profile.get(skill, 0.3))
        score = float(skill_scores.get(skill, 0.0))
        uncovered = 1.0 if skill not in covered else 0.0
        return (weight * (1.0 - score) + uncovered, weight)

    return max(available_skills, key=_priority)


def _normalize_difficulty(value: Any, fallback: str) -> str:
    normalized = str(value or "").strip().lower()
    if normalized in {"easy", "medium", "hard"}:
        return normalized
    return fallback


async def plan_next_step(context: dict[str, Any]) -> PlanOutput:
    minimal_state = context.get("minimal_state") or {}
    evaluation = context.get("evaluation") or {}

    score = _to_float(
        minimal_state.get("last_score", (context.get("evaluation") or {}).get("score", 0.5)),
        default=0.5,
    )
    fallback_mode, fallback_difficulty, fallback_tone = _score_to_mode(score)

    intent = str(evaluation.get("intent") or "").strip().lower()
    clarity = str(evaluation.get("clarity") or "").strip().lower()
    depth = str(evaluation.get("depth") or "").strip().lower()

    mode_map = {
        "no_understanding": "help",
        "partial_understanding": "probe",
        "clear_understanding": "challenge",
    }
    mode = mode_map.get(intent, fallback_mode)

    tone_map = {
        "help": "supportive",
        "probe": "neutral",
        "challenge": "challenging",
    }
    tone = tone_map.get(mode, fallback_tone)

    depth_difficulty = _difficulty_from_depth(depth)
    difficulty = _normalize_difficulty(minimal_state.get("difficulty"), depth_difficulty)

    if clarity == "poor":
        mode = "help"
        tone = "supportive"
        difficulty = "easy"

    requested_topic = str(minimal_state.get("topic") or "").strip().lower()
    if requested_topic:
        target_skill = requested_topic
    else:
        target_skill = _pick_priority_skill(context, fallback=_pick_target_skill(context, fallback="backend fundamentals"))

    reason_parts = [f"Mode selected from score {score:.2f}"]
    if intent in mode_map:
        reason_parts.append(f"intent={intent}")
    if depth in {"shallow", "basic", "good", "strong"}:
        reason_parts.append(f"depth={depth}")
    if clarity in {"poor", "okay", "clear"}:
        reason_parts.append(f"clarity={clarity}")
    if clarity == "poor":
        reason_parts.append("clarification prioritized")

    return PlanOutput(
        action=mode,
        target_skill=target_skill,
        reason=", ".join(reason_parts),
        difficulty=difficulty,
        tone=tone,
    )
