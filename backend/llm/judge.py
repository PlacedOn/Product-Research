import asyncio

from backend.llm.ollama_client import call_ollama
from backend.schemas.judge_schema import JudgeInput, JudgeOutput
from backend.utils.json_utils import extract_json

_JUDGE_MODEL = "llama3"


async def evaluate_answer(question: str, answer: str) -> JudgeOutput:
    judge_input = JudgeInput(question=question, answer=answer)
    prompt = f"""
You are a strict technical evaluator.

Evaluate the answer.

Return ONLY JSON:
{{
  "score": 0.0-1.0,
  "confidence": 0.0-1.0,
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missing_concepts": ["string"]
}}

Question: {judge_input.question}
Answer: {judge_input.answer}
"""
    output = await asyncio.to_thread(call_ollama, prompt, _JUDGE_MODEL)
    payload = extract_json(output)
    return JudgeOutput.model_validate(payload)
