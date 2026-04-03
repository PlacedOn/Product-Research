import asyncio
from typing import Any

from backend.llm.ollama_client import call_ollama
from backend.schemas.generator_schema import GeneratorInput, QuestionOutput
from backend.utils.json_utils import extract_json

_GENERATOR_MODEL = "llama3"


def _normalize_question_type(strategy: str) -> str:
    if strategy in {"follow_up", "deep_dive"}:
        return "conceptual"
    return strategy


async def generate_question(
    context: dict[str, Any],
    strategy: str,
    previous_qna: dict[str, Any] | None = None,
) -> QuestionOutput:
    raw_previous = previous_qna if previous_qna is not None else context.get("previous_context", [])
    if isinstance(raw_previous, list):
        previous_context = raw_previous
    else:
        previous_context = [
            {
                "note": str(raw_previous),
            }
        ]

    parsed_context = GeneratorInput.model_validate(
        {
            **context,
            "strategy": strategy,
            "previous_context": previous_context,
        }
    )

    normalized_type = _normalize_question_type(parsed_context.strategy)
    prompt = f"""
You are a technical interviewer.

Generate ONE interview question.

Rules:
- Tie the question to the job role and candidate profile.
- Keep focus on this skill: {parsed_context.focus_skill}.
- Use this strategy: {parsed_context.strategy}.
- The question must be progressive relative to previous_context and not random.
- Do not repeat prior questions.
- Match difficulty to candidate experience and job level.

Return ONLY JSON:
{{
  "question": "string",
  "skill": "string",
  "difficulty": "easy | medium | hard",
  "type": "conceptual | system_design | behavioral"
}}

Context:
{parsed_context.model_dump_json()}

Set "type" to "{normalized_type}" unless role fit is impossible.
"""
    output = await asyncio.to_thread(
        call_ollama,
        prompt,
        _GENERATOR_MODEL,
        {
            "temperature": 0.2,
            "top_p": 0.9,
        },
    )
    payload = extract_json(output)
    return QuestionOutput.model_validate(payload)
