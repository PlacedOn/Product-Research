from __future__ import annotations
from typing import Optional, Union
import asyncio
import re

from backend.llm.ollama_client import call_ollama
from backend.schemas.judge_schema import JudgeInput, JudgeOutput
from backend.utils.json_utils import extract_json

_JUDGE_MODEL = "llama3:8b-instruct-q4_0"

_WEAK_CONFIDENCE_MAX = 0.6
_MEDIUM_CONFIDENCE_MIN = 0.5
_MEDIUM_CONFIDENCE_MAX = 0.75
_STRONG_CONFIDENCE_MIN = 0.8

_EXPLANATION_MARKERS = (
    "because",
    "so that",
    "using",
    "through",
    "works by",
    "ensures",
    "to avoid",
)

_MECHANISM_MARKERS = (
    "ttl",
    "invalidation",
    "cache key",
    "eviction",
    "retry",
    "backoff",
    "replication",
    "lock",
    "queue",
    "transaction",
    "asked",
    "aligned",
    "followed up",
    "listened",
    "coached",
    "delegated",
    "de-escalated",
    "prioritized",
    "validated",
)

_TRADEOFF_MARKERS = (
    "trade-off",
    "tradeoff",
    "however",
    "but",
    "latency",
    "consistency",
    "complexity",
    "cost",
    "stale",
    "memory",
    "edge case",
    "stakeholder",
    "deadline",
    "pressure",
    "constraint",
    "conflict",
    "balance",
)

_TOOL_MARKERS = (
    "redis",
    "kafka",
    "rabbitmq",
    "mongodb",
    "postgres",
    "mysql",
    "memcached",
    "elasticsearch",
    "slack",
    "jira",
    "1:1",
    "retro",
)

_EXAMPLE_MARKERS = (
    "for example",
    "for instance",
    "when i",
    "one time",
    "in that situation",
    "the result",
)


def build_judge_prompt(question: str, answer: str, prompt_template: Optional[str] = None) -> str:
    if prompt_template:
        return prompt_template.format(question=question, answer=answer)

    # CTO Calibration: Load few-shot examples from 'Gold' Kaggle data
    try:
        import csv
        with open("/Users/nishantsingh/Desktop/Placedon/Product-Research/PlacedOn/training/real_world_gold.csv", "r") as f:
            reader = csv.DictReader(f)
            examples = list(reader)[:3] # Top 3 for context
            ref_guide = "\n".join([
                f"- Example Answer: \"{e['answer']}\"\n  Target Score: {e['quality_score']} | Rationale: {e['rationale']}"
                for e in examples
            ])
    except Exception:
        ref_guide = "N/A"

    return f"""
Evaluate the interview answer strictly.
Use the following Real-World Reference Guide (calibrated from Kaggle datasets) to anchor your scores:
{ref_guide}

Evaluation Principles:
1. Do not reward buzzwords, personality claims, or confidence style without evidence.
2. Concrete examples, mechanisms, reasoning, and trade-offs should raise the score.
3. Keyword-only answers without explanation must score below 0.4.

Return JSON only:
{{
  "score": 0.0-1.0,
  "confidence": 0.0-1.0,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "missing_concepts": ["..."],
  "intent": "no_understanding | partial_understanding | clear_understanding",
  "depth": "shallow | basic | good | strong",
  "clarity": "poor | okay | clear"
}}

Question: {question}
Answer: {answer}
"""


def _clip(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def _analyze_answer(answer: str) -> dict[str, Union[bool, int]]:
    normalized = answer.strip().lower()
    tokens = re.findall(r"\b\w[\w-]*\b", normalized)
    token_count = len(tokens)

    has_explanation = any(marker in normalized for marker in _EXPLANATION_MARKERS)
    has_mechanism = any(marker in normalized for marker in _MECHANISM_MARKERS)
    has_tradeoff = any(marker in normalized for marker in _TRADEOFF_MARKERS)
    mentions_tool = any(marker in normalized for marker in _TOOL_MARKERS)
    has_example = any(marker in normalized for marker in _EXAMPLE_MARKERS)

    very_short = token_count <= 3
    keyword_only = token_count <= 6 and not has_explanation and not has_mechanism and not has_example
    vague = token_count < 12 and not has_explanation and not has_mechanism and not has_example

    return {
        "token_count": token_count,
        "has_explanation": has_explanation,
        "has_mechanism": has_mechanism,
        "has_tradeoff": has_tradeoff,
        "mentions_tool": mentions_tool,
        "has_example": has_example,
        "very_short": very_short,
        "keyword_only": keyword_only,
        "vague": vague,
    }


def _depth_from_score(score: float) -> str:
    if score < 0.35:
        return "shallow"
    if score < 0.6:
        return "basic"
    if score < 0.8:
        return "good"
    return "strong"


def _clarity_from_signals(signals: dict[str, Union[bool, int]]) -> str:
    token_count = int(signals["token_count"])
    if bool(signals["very_short"]) or bool(signals["keyword_only"]) or bool(signals["vague"]):
        return "poor"
    if (
        bool(signals["has_explanation"])
        and (bool(signals["has_mechanism"]) or bool(signals["has_example"]))
        and token_count >= 12
    ):
        return "clear"
    return "okay"


def _intent_from_signals(signals: dict[str, Union[bool, int]], score: float) -> str:
    if bool(signals["very_short"]) or bool(signals["keyword_only"]):
        return "no_understanding"

    has_substance = (
        bool(signals["has_explanation"])
        or bool(signals["has_mechanism"])
        or bool(signals["has_example"])
    )
    if has_substance and score >= 0.72 and (bool(signals["has_tradeoff"]) or int(signals["token_count"]) >= 18):
        return "clear_understanding"

    if has_substance:
        return "partial_understanding"

    if score < 0.35:
        return "no_understanding"
    return "partial_understanding"


def _calibrate_output(evaluation: JudgeOutput, answer: str) -> JudgeOutput:
    signals = _analyze_answer(answer)
    score = float(evaluation.score)
    confidence = float(evaluation.confidence)

    weaknesses = list(evaluation.weaknesses)
    missing = list(evaluation.missing_concepts)

    # Keep model judgment primary; only hard-cap obvious shallow responses.
    if bool(signals["very_short"]):
        if bool(signals["mentions_tool"]):
            score = min(score, 0.25)
        else:
            score = min(max(score, 0.25), 0.35)
        weaknesses.append("Answer is too short to demonstrate substantive understanding.")
    elif bool(signals["keyword_only"]):
        if bool(signals["mentions_tool"]):
            score = min(score, 0.35)
            weaknesses.append("Mentions keywords without explaining mechanism, example, or reasoning.")
        else:
            score = min(max(score, 0.25), 0.35)
            weaknesses.append("Generic statement lacks concrete evidence, mechanism, or reasoning.")
    elif bool(signals["vague"]):
        score = min(score, 0.50)

    # Mechanism-bearing answers should not collapse into shallow bands even if model is overly strict.
    if (bool(signals["has_mechanism"]) or bool(signals["has_example"])) and int(signals["token_count"]) >= 6 and score < 0.4:
        score = 0.45

    # Reward depth indicators with small nudges to avoid brittle rubric-only behavior.
    if bool(signals["has_explanation"]) and bool(signals["has_mechanism"]):
        score += 0.04
    if bool(signals["has_example"]):
        score += 0.03
    if bool(signals["has_tradeoff"]):
        score += 0.05
    if int(signals["token_count"]) >= 35 and bool(signals["has_explanation"]):
        score += 0.03

    score = _clip(score)

    depth = _depth_from_score(score)
    clarity = _clarity_from_signals(signals)
    intent = _intent_from_signals(signals, score)

    if score < 0.4:
        confidence = min(confidence, _WEAK_CONFIDENCE_MAX)
        if "How the approach works" not in missing:
            missing.append("How the approach works")
        if "Concrete example or reasoning" not in missing:
            missing.append("Concrete example or reasoning")
    elif score < 0.7:
        confidence = _clip(confidence, _MEDIUM_CONFIDENCE_MIN, _MEDIUM_CONFIDENCE_MAX)
    elif score >= 0.85:
        confidence = max(confidence, _STRONG_CONFIDENCE_MIN)

    # Keep confidence bands aligned with the inferred depth bucket.
    if depth == "shallow":
        confidence = min(confidence, 0.55)
    elif depth == "basic":
        confidence = _clip(confidence, 0.5, 0.72)
    elif depth == "good":
        confidence = _clip(confidence, 0.65, 0.85)
    else:
        confidence = max(confidence, _STRONG_CONFIDENCE_MIN)

    if clarity == "poor" and "Clear explanation of approach" not in missing:
        missing.append("Clear explanation of approach")

    return JudgeOutput(
        score=round(score, 3),
        confidence=round(_clip(confidence), 3),
        strengths=evaluation.strengths,
        weaknesses=list(dict.fromkeys(weaknesses)),
        missing_concepts=list(dict.fromkeys(missing)),
        intent=intent,
        depth=depth,
        clarity=clarity,
    )


def _fallback_judge_output(error: Exception) -> JudgeOutput:
    return JudgeOutput(
        score=0.2,
        confidence=0.55,
        strengths=[],
        weaknesses=[
            "Judge output parsing failed; defaulting to conservative evaluation.",
            f"Parsing error: {type(error).__name__}",
        ],
        missing_concepts=[
            "Clear explanation of the approach",
            "Evidence, reasoning, and trade-offs",
        ],
        intent="no_understanding",
        depth="shallow",
        clarity="poor",
    )


async def evaluate_answer(
    question: str,
    answer: str,
    prompt_template:Optional[ str] = None,
    model: str = _JUDGE_MODEL,
) -> JudgeOutput:
    judge_input = JudgeInput(question=question, answer=answer)
    prompt = build_judge_prompt(
        question=judge_input.question,
        answer=judge_input.answer,
        prompt_template=prompt_template,
    )
    try:
        output = await asyncio.to_thread(
            call_ollama,
            prompt,
            model,
            {
                "temperature": 0.1,
                "top_p": 0.9,
                "num_predict": 128,
                "timeout_seconds": 12,
            },
        )
        payload = extract_json(output)
        raw_evaluation = JudgeOutput.model_validate(payload)
    except Exception as exc:  # pragma: no cover
        from aot_layer.mock_llm import evaluate_answer_text
        mock_result = await evaluate_answer_text(judge_input.question, judge_input.answer)
        
        return JudgeOutput(
            score=mock_result.confidence,
            confidence=mock_result.confidence,
            strengths=mock_result.evidence,
            weaknesses=["Mock evaluation used due to LLM unavailability"],
            missing_concepts=mock_result.missing,
            intent="partial_understanding" if mock_result.direction == "partial" else "clear_understanding",
            depth="basic" if mock_result.direction == "partial" else "strong",
            clarity="clear",
        )

    return _calibrate_output(raw_evaluation, judge_input.answer)
