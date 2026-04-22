from __future__ import annotations
from app.models import InterviewState


def _trim(text: str, max_len: int) -> str:
    normalized = " ".join(text.split())
    if len(normalized) <= max_len:
        return normalized
    if max_len <= 3:
        return normalized[:max_len]
    return normalized[: max_len - 3] + "..."


def compress_state(state: InterviewState, last_n_turns: int = 2) -> str:
    weakest_skill_label = "none"
    if state.skill_vector:
        weakest_index = min(range(len(state.skill_vector)), key=state.skill_vector.__getitem__)
        weakest_skill_label = f"skill_{weakest_index}({state.skill_vector[weakest_index]:.2f})"

    performance_summary = "none"
    if state.performance:
        performance_summary = ",".join(
            f"{key}:{value}" for key, value in sorted(state.performance.items())
        )

    compressed = (
        f"last_question={state.last_question or 'none'} | "
        f"last_answer={state.last_answer or 'none'} | "
        f"weakest_skill={weakest_skill_label} | "
        f"performance={performance_summary} | "
        f"turn_hint={min(max(state.turn, 0), max(last_n_turns, 0))}"
    )

    return _trim(compressed, max_len=400)
