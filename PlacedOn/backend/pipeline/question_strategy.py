from __future__ import annotations


def decide_question_type(state: dict) -> str:
    override = state.get("next_strategy")
    if isinstance(override, str) and override:
        return override

    round_index = int(state.get("round", 1))
    last_score = state.get("last_score")

    if isinstance(last_score, (int, float)):
        if last_score < 0.5:
            return "follow_up"
        if last_score > 0.8 and round_index > 2:
            return "deep_dive"

    if round_index <= 2:
        return "conceptual"
    if round_index <= 4:
        return "system_design"
    return "behavioral"
