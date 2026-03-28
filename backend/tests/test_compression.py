from app.models import InterviewState
from app.state_compressor import compress_state


def test_compress_state_contains_required_fields_and_max_len() -> None:
    state = InterviewState(
        interview_id="iv-1",
        turn=3,
        last_question="Explain your caching strategy for distributed systems.",
        last_answer=(
            "I use layered caches with consistent hashing, proactive warming, and invalidation "
            "driven by domain events to keep consistency guarantees explicit."
        ),
        skill_vector=[0.82, 0.31, 0.67],
        performance={"latency": "good", "accuracy": "steady"},
    )

    result = compress_state(state)

    assert len(result) <= 400
    assert "last_question=" in result
    assert "last_answer=" in result
    assert "weakest_skill=skill_1(" in result
    assert "performance=" in result
