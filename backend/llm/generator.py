import asyncio
import re
from typing import Any

from backend.llm.ollama_client import call_ollama
from backend.schemas.generator_schema import GeneratorInput, PlanOutput, QuestionOutput
from backend.utils.json_utils import extract_json

_GENERATOR_MODEL = "llama3:8b-instruct-q4_0"


def _default_question_type(action: str) -> str:
    if action == "challenge":
        return "system_design"
    if action == "help":
        return "conceptual"
    return "behavioral"


def _normalized_question(value: str) -> str:
    normalized = re.sub(r"[^a-z0-9\s]", " ", value.lower())
    return re.sub(r"\s+", " ", normalized).strip()


def _is_duplicate_question(candidate: str, *previous: str) -> bool:
    normalized_candidate = _normalized_question(candidate)
    if not normalized_candidate:
        return False
    return any(normalized_candidate == _normalized_question(item) for item in previous if item)


def _looks_like_interviewer_question(text: str) -> bool:
    candidate = (text or "").strip().lower()
    if not candidate:
        return False

    # Hard reject obvious answer-like starts from candidate perspective.
    answer_like_starts = (
        "i ",
        "i'm ",
        "im ",
        "my ",
        "we ",
        "in my ",
    )
    if candidate.startswith(answer_like_starts):
        return False

    # Prefer explicit question punctuation, but also allow clear interviewer prompts.
    if "?" in candidate:
        return True

    interviewer_prompt_starts = (
        "tell me",
        "walk me",
        "can you",
        "could you",
        "how would",
        "what would",
        "why would",
        "explain",
        "describe",
    )
    return candidate.startswith(interviewer_prompt_starts)


def _fallback_prompt_variants(action: str, skill: str) -> list[str]:
    prompts: dict[str, list[str]] = {
        "help": [
            f"Let's simplify this with one concrete Python example. How would you approach it step by step?",
            f"No rush. Pick one {skill} scenario and walk me through your solution in clear steps.",
            f"Let's break this down. For {skill}, what is step 1, step 2, and step 3 in your approach?",
        ],
        "probe": [
            f"Let's go one level deeper on {skill}. Can you explain your approach step by step?",
            f"In {skill}, what trade-off guides your approach? Explain your steps clearly.",
            f"Walk me through your {skill} approach from first decision to final validation.",
        ],
        "challenge": [
            f"Let's stress-test your {skill} approach under high scale. What are your exact steps?",
            f"Assume one part of your {skill} design fails. How would you adapt, step by step?",
            f"Defend your {skill} approach against latency and reliability constraints, step by step.",
        ],
    }
    return prompts.get(action, [f"Let's continue with {skill}. Explain your approach step by step."])


def _fallback_question(
    plan: PlanOutput,
    context: GeneratorInput | None = None,
    mode: str | None = None,
    skill: str | None = None,
    difficulty: str | None = None,
) -> QuestionOutput:
    mode = mode or plan.action
    skill = skill or plan.target_skill
    difficulty = difficulty or plan.difficulty

    variants = _fallback_prompt_variants(mode, skill)
    question = variants[0]

    if context is not None:
        prev_a = context.last_question
        prev_b = context.previous_question

        for variant in variants:
            if not _is_duplicate_question(variant, prev_a, prev_b):
                question = variant
                break

    return QuestionOutput(
        question=question,
        skill=skill,
        difficulty=difficulty,
        type=_default_question_type(mode),
    )


async def generate_question(
    plan: PlanOutput | dict[str, Any],
    context: dict[str, Any],
) -> QuestionOutput:
    plan_payload = plan.model_dump() if isinstance(plan, PlanOutput) else plan

    parsed_context = GeneratorInput.model_validate(
        {
            **context,
            "plan": plan_payload,
        }
    )

    mode = str(plan_payload.get("action") or parsed_context.plan.action)
    target_skill = str(plan_payload.get("target_skill") or parsed_context.plan.target_skill)
    difficulty = str(plan_payload.get("difficulty") or parsed_context.plan.difficulty)
    default_type = _default_question_type(mode)
    prompt = f"""
Generate one interview question in JSON.
mode: {mode}
topic: {target_skill}
difficulty: {difficulty}
last_question: {parsed_context.last_question}
last_answer: {parsed_context.last_answer}
minimal_state: {parsed_context.minimal_state}
previous_question: {parsed_context.previous_question}

Keep it concise, natural, and not a duplicate. Reuse prior question pattern with small variation when useful.

Return JSON only:
{{
  "question": "string",
  "skill": "string",
  "difficulty": "easy | medium | hard",
  "type": "conceptual | system_design | behavioral"
}}
Set "type" to "{default_type}" unless it clearly does not fit.
"""

    try:
        output = await asyncio.to_thread(
            call_ollama,
            prompt,
            _GENERATOR_MODEL,
            {
                "temperature": 0.2,
                "top_p": 0.9,
                "num_predict": 96,
                "timeout_seconds": 12,
            },
        )
        payload = extract_json(output)
        result = QuestionOutput.model_validate(payload)
        if not _looks_like_interviewer_question(result.question):
            return _fallback_question(
                parsed_context.plan,
                parsed_context,
                mode=mode,
                skill=target_skill,
                difficulty=difficulty,
            )
        if _is_duplicate_question(result.question, parsed_context.last_question, parsed_context.previous_question):
            return _fallback_question(
                parsed_context.plan,
                parsed_context,
                mode=mode,
                skill=target_skill,
                difficulty=difficulty,
            )
        return result
    except Exception:  # noqa: BLE001
        return _fallback_question(
            parsed_context.plan,
            parsed_context,
            mode=mode,
            skill=target_skill,
            difficulty=difficulty,
        )
