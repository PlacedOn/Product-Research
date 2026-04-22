import json

from simulation.candidate import GroundTruthProfile
from training.simulation_room import (
    _simulated_judge_call,
    _target_score,
    _update_sampling_weights,
)


def test_target_score_prioritizes_skill_over_persona() -> None:
    profile = GroundTruthProfile(
        skills={
            "caching": 0.8,
            "concurrency": 0.7,
            "api_design": 0.6,
            "system_design": 0.5,
        },
        persona_score=1.0,
    )

    score = _target_score(profile)
    assert 0.6 < score < 0.75


def test_sampling_weights_shift_toward_high_error_archetypes() -> None:
    updated = _update_sampling_weights(
        current_weights={"buzzword_king": 0.5, "balanced_operator": 0.5},
        errors_by_archetype={"buzzword_king": [0.42, 0.39], "balanced_operator": [0.08, 0.1]},
        mistake_counts={"buzzword_king": 3, "balanced_operator": 0},
    )

    assert updated["buzzword_king"] > updated["balanced_operator"]
    assert round(sum(updated.values()), 6) == 1.0


def test_simulated_judge_rewards_mechanism_and_tradeoff() -> None:
    prompt = """
Question: Explain your caching strategy.
Answer: I use Redis with TTL and invalidation because stale reads hurt correctness, but shorter TTL increases load.
""".strip()

    payload = json.loads(_simulated_judge_call(prompt))
    assert payload["score"] > 0.6
    assert payload["confidence"] > 0.6
