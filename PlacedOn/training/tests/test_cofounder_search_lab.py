from training.cofounder_search_lab import (
    SEARCH_SPACE,
    _candidate_catalog,
    _coverage_configs,
    _trial_reward,
    _ventures,
    _weighted_fit,
)


def test_coverage_configs_touch_all_parameter_values() -> None:
    configs = _coverage_configs()

    for name, values in SEARCH_SPACE.items():
        seen = {config[name] for config in configs}
        assert seen == set(values)


def test_weighted_fit_prefers_hrx_seed_candidate_with_behavioral_strength() -> None:
    venture = next(item for item in _ventures() if item.name == "HRX Seed Maze")
    candidates = {candidate.name: candidate for candidate in _candidate_catalog()}

    mira_fit = _weighted_fit(candidates["Mira"].traits, venture.target_vector)
    kabir_fit = _weighted_fit(candidates["Kabir"].traits, venture.target_vector)

    assert mira_fit > kabir_fit


def test_trial_reward_penalizes_bad_selection_and_high_error() -> None:
    strong = _trial_reward(
        selection_accuracy=1.0,
        selected_true_fit=0.9,
        psychometric_mae=0.15,
        solve_rate=0.8,
        efficiency=0.85,
    )
    weak = _trial_reward(
        selection_accuracy=0.0,
        selected_true_fit=0.4,
        psychometric_mae=0.45,
        solve_rate=0.3,
        efficiency=0.4,
    )

    assert strong > weak
