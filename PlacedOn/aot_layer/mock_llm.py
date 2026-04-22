from __future__ import annotations
from aot_layer.models import Difficulty, JudgeResult, Mode

SKILL_CONCEPTS: dict[str, list[str]] = {
    "caching": ["ttl", "invalidation", "cache key"],
    "concurrency": ["locking", "race condition", "idempotency"],
    "api_design": ["versioning", "pagination", "rate limit"],
    "backend": ["api", "service", "stateless", "http", "contract"],
    "db_design": ["index", "schema", "normalization", "query", "scale"],
    "system_design": ["trade-off", "scalability", "bottleneck", "load balance"],
    "block_4_grit": ["persistent", "setback", "continued", "follow through"],
    "block_6_social": ["team", "trust", "listen", "empathy"],
    "block_10_calibration": ["uncertainty", "validated", "checked", "assumption"],
}


async def generate_question_text(target_skill: str, difficulty: Difficulty, mode: Mode) -> str:
    base_context = {
        "caching": "your read-heavy product catalog service",
        "concurrency": "a high-throughput background worker fleet",
        "api_design": "a public multi-tenant REST API",
        "backend": "a distributed microservices architecture",
        "db_design": "a high-write relational database",
    }.get(target_skill, "a production backend system")

    if mode == "new":
        return (
            f"In {base_context}, design a {difficulty} strategy focused on {target_skill}. "
            "Explain architecture trade-offs and operational safeguards."
        )

    if mode == "probe":
        return (
            f"Follow-up on {target_skill}: go deeper into failure handling in {base_context}. "
            "What exact signals and mitigations would you apply?"
        )

    return (
        f"Retry with a hint for {target_skill}: include concrete mechanisms used in {base_context}, "
        "and name at least one implementation detail."
    )


async def evaluate_answer_text(skill: str, answer: str) -> JudgeResult:
    # CTO Calibration: Check for real-world Gold matches first
    try:
        import csv
        with open("/Users/nishantsingh/Desktop/Placedon/Product-Research/PlacedOn/training/real_world_gold.csv", "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row['skill'] == skill and row['answer'].lower() in answer.lower():
                     # High-fidelity match from gold data
                     return JudgeResult(
                         direction="correct" if float(row['quality_score']) > 0.6 else "wrong",
                         confidence=float(row['quality_score']),
                         evidence=["Gold-Standard Match"],
                         missing=[],
                         probe_recommended=False,
                         probe_focus=[],
                         recovery_possible=True
                     )
    except Exception:
        pass

    concepts = SKILL_CONCEPTS.get(skill, ["trade-off", "scalability", "reliability"])
    lowered = answer.lower()

    evidence: list[str] = []
    for concept in concepts:
        if concept in lowered:
            evidence.append(concept)

    missing = [concept for concept in concepts if concept not in evidence]

    if len(evidence) == len(concepts):
        direction = "correct"
    elif len(evidence) > 0:
        direction = "partial"
    else:
        direction = "wrong"

    # Calibration: Ensure score isn't zero for meaningful length
    confidence = round(len(evidence) / len(concepts), 2)
    if confidence == 0 and len(answer.split()) > 10:
        confidence = 0.25 # Baseline for effort

    probe_recommended = direction == "partial" and bool(missing)
    recovery_possible = direction == "wrong"

    return JudgeResult(
        direction=direction,
        confidence=confidence,
        evidence=evidence,
        missing=missing,
        probe_recommended=probe_recommended,
        probe_focus=missing[:2],
        recovery_possible=recovery_possible,
    )
