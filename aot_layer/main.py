import asyncio
import os
import sys

if __package__ in (None, ""):
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from aot_layer.config import AoTConfig
from aot_layer.models import StartInput
from aot_layer.orchestrator import AoTOrchestrator


async def simulated_answer_provider(turn_idx: int, question: str, skill: str, mode: str) -> str:
    scripted: dict[tuple[str, str], str] = {
        ("caching", "new"): "I use ttl and cache key design for read-heavy traffic.",
        ("caching", "probe"): "I include invalidation with event triggers and ttl fallback.",
        ("concurrency", "new"): "I am not sure.",
        ("concurrency", "retry"): "I now mention locking and idempotency to avoid race condition.",
        ("api_design", "new"): "I handle versioning, pagination, and rate limit policy.",
    }

    return scripted.get((skill, mode), "I would evaluate trade-offs and ensure reliability.")


async def run_demo() -> None:
    config = AoTConfig(total_turn_limit=6)
    orchestrator = AoTOrchestrator(config=config)

    start = StartInput(
        skill_vector=[0.4, 0.5, 0.6],
        sigma2=[0.9, 0.8, 0.2],
        past_attempts_per_skill={"caching": 0, "concurrency": 0, "api_design": 0},
    )

    result = await orchestrator.run(start_input=start, answer_provider=simulated_answer_provider, max_turns=5)

    for log in result.logs:
        print(f"[Controller] Target skill: {log.skill} | mode={log.mode}")
        print(f"[Question] {log.question}")
        print(f"[Answer] {log.answer}")
        print(
            f"[Judge] direction={log.judge.direction}, confidence={log.judge.confidence} "
            f"-> {log.controller_action}"
        )
        print("-" * 72)


if __name__ == "__main__":
    asyncio.run(run_demo())
