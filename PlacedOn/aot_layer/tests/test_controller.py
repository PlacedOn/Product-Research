import asyncio

from aot_layer.config import AoTConfig
from aot_layer.controller import Controller
from aot_layer.decomposer import Decomposer
from aot_layer.models import InterviewState, JudgeResult


def _base_state() -> InterviewState:
    return InterviewState(
        skills=["caching", "concurrency", "api_design"],
        skill_vector={"caching": 0.4, "concurrency": 0.5, "api_design": 0.6},
        sigma2={"caching": 0.9, "concurrency": 0.7, "api_design": 0.3},
        turn_index=0,
        current_skill="caching",
        current_difficulty="medium",
        consecutive_turns={"caching": 0, "concurrency": 0, "api_design": 0},
        turns_per_skill={"caching": 0, "concurrency": 0, "api_design": 0},
        probes_per_skill={"caching": 0, "concurrency": 0, "api_design": 0},
        retries_per_skill={"caching": 0, "concurrency": 0, "api_design": 0},
    )


def test_controller_respects_probe_and_retry_limits() -> None:
    config = AoTConfig(max_probes_per_skill=2, max_retries_per_skill=2)
    controller = Controller(config)
    state = _base_state()

    partial = JudgeResult(
        direction="partial",
        confidence=0.5,
        evidence=["ttl"],
        missing=["invalidation", "cache key"],
        probe_recommended=True,
        probe_focus=["invalidation"],
        recovery_possible=False,
    )

    wrong = JudgeResult(
        direction="wrong",
        confidence=0.0,
        evidence=[],
        missing=["locking", "race condition", "idempotency"],
        probe_recommended=False,
        probe_focus=[],
        recovery_possible=True,
    )

    state.current_skill = "caching"
    state.probes_per_skill["caching"] = 2
    decision_partial = asyncio.run(controller.decide_end(state, partial))
    assert decision_partial.action == "move"

    state.current_skill = "concurrency"
    state.retries_per_skill["concurrency"] = 2
    decision_wrong = asyncio.run(controller.decide_end(state, wrong))
    assert decision_wrong.action == "move"


def test_controller_skill_rotation_when_consecutive_limit_hit() -> None:
    config = AoTConfig(max_consecutive_per_skill=2)
    controller = Controller(config)
    decomposer = Decomposer()
    state = _base_state()
    state.consecutive_turns["caching"] = 2
    start = asyncio.run(controller.decide_start(state, decomposer))

    assert start.target_skill != "caching"
    assert start.target_skill in state.skills


def test_controller_uses_strategic_probe_for_incomplete_midscore_answer() -> None:
    config = AoTConfig(
        max_probes_per_skill=2,
        strategic_probe_score_floor=0.5,
        strategic_probe_score_ceiling=0.8,
        strategic_probe_missing_threshold=2,
    )
    controller = Controller(config)
    state = _base_state()
    state.current_skill = "caching"

    nuanced_but_incomplete = JudgeResult(
        direction="correct",
        score=0.68,
        confidence=0.62,
        evidence=["ttl", "invalidation"],
        missing=["eviction policy", "failure mode"],
        probe_recommended=False,
        probe_focus=[],
        recovery_possible=False,
    )

    decision = asyncio.run(controller.decide_end(state, nuanced_but_incomplete))
    assert decision.action == "probe"
    assert decision.next_mode == "probe"
