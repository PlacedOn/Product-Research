from __future__ import annotations
import asyncio
import os
import sys

if __package__ in (None, ""):
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from aot_layer.models import StartInput
from interview_system.orchestrator import FullStackInterviewOrchestrator


async def scripted_answer_provider(turn_idx: int, question: str, skill: str, mode: str) -> str:
    scripted: dict[tuple[str, str], str] = {
        ("caching", "new"): "I use ttl, cache key versioning, and event invalidation.",
        ("caching", "probe"): "I add stale-while-revalidate and correctness guardrails.",
        ("concurrency", "new"): "I reason about locks, idempotency, and queueing.",
        ("api_design", "new"): "I design pagination and rate limiting with trade-offs.",
    }
    return scripted.get((skill, mode), "I analyze trade-offs and optimize reliability.")


async def run_demo() -> None:
    from aot_layer.config import AoTConfig
    
    skills = ["caching", "concurrency", "api_design"]
    config = AoTConfig(skills=skills)
    orchestrator = FullStackInterviewOrchestrator(config=config)

    start = StartInput(
        skill_vector=[0.45, 0.42, 0.51],
        sigma2=[0.8, 0.7, 0.6],
        past_attempts_per_skill={s: 0 for s in skills},
    )

    result = await orchestrator.run(
        candidate_id="cand-fullstack-001",
        start_input=start,
        answer_provider=scripted_answer_provider,
        role_vector=[0.3, 0.2, 0.4],
        preference_vector=[0.28, 0.24, 0.38],
        max_turns=4,
    )

    print("[Architecture] L4 -> L3 -> Candidate, L2 -> L3 trust, then L5 aggregation")
    for turn in result.turns:
        status = "fallback" if turn.used_fallback else "approved"
        print(
            f"[Turn {turn.turn}] skill={turn.skill} mode={turn.mode} "
            f"trust={turn.trust_score} question_status={status}"
        )

    print(f"[Layer5] Candidate saved: {result.candidate_profile.candidate_id}")
    print(f"[Fit] {result.fit.fit_score} ({result.fit.interpretation})")
    print(f"[Profile] {result.rendered_profile.summary}")


if __name__ == "__main__":
    asyncio.run(run_demo())
