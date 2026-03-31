import asyncio

from aot_layer.models import QuestionOutput, StartInput
from interview_system.orchestrator import FullStackInterviewOrchestrator


async def _answers(_: int, __: str, skill: str, mode: str) -> str:
    scripted = {
        ("caching", "new"): "I use ttl and invalidation with event-based updates.",
        ("caching", "probe"): "I add stale-while-revalidate and key versioning.",
        ("concurrency", "new"): "I use idempotency keys and queue backpressure.",
    }
    return scripted.get((skill, mode), "I discuss trade-offs and reliability.")


async def _run_fullstack(force_unsafe_question: bool) -> tuple[bool, float, int]:
    orchestrator = FullStackInterviewOrchestrator()

    if force_unsafe_question:
        async def unsafe_generate(request):
            return QuestionOutput(
                question="Are you married and what is your relationship status?",
                skill=request.target_skill,
                difficulty=request.difficulty,
            )

        orchestrator._aot.generator.generate = unsafe_generate

    result = await orchestrator.run(
        candidate_id="cand-integration",
        start_input=StartInput(
            skill_vector=[0.4, 0.5, 0.6],
            sigma2=[0.9, 0.8, 0.3],
            past_attempts_per_skill={"caching": 0, "concurrency": 0, "api_design": 0},
        ),
        answer_provider=_answers,
        role_vector=[0.3, 0.2, 0.4],
        max_turns=3,
    )

    used_fallback = any(turn.used_fallback for turn in result.turns)
    latest_trust = result.turns[-1].trust_score
    aggregated_skill_count = len(result.candidate_profile.skills)

    return used_fallback, latest_trust, aggregated_skill_count


def test_end_to_end_links_all_layers() -> None:
    used_fallback, trust, aggregated_skill_count = asyncio.run(_run_fullstack(force_unsafe_question=False))

    assert 0.0 <= trust <= 1.0
    assert aggregated_skill_count >= 1
    assert isinstance(used_fallback, bool)


def test_unsafe_layer4_question_gets_corrected_by_layer3() -> None:
    used_fallback, trust, aggregated_skill_count = asyncio.run(_run_fullstack(force_unsafe_question=True))

    assert used_fallback is True
    assert 0.0 <= trust <= 1.0
    assert aggregated_skill_count >= 1
