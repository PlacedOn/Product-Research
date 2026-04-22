# Co-Founder Search Lab Output

Date: 2026-04-22

## Scope

This report documents the new founder-search simulation built for the thinking model.
The setup keeps the production brain stable while giving the model a harder training surface:

- `HRX` acts as the CEO / decision-maker
- a hidden co-founder candidate is embedded inside a candidate slate
- the thinking model must reason through leadership, ownership, social trust, calibration, and technical trade-offs
- the controller is rewarded for selecting the correct co-founder while keeping psychometric error low

Raw artifacts:

- `PlacedOn/training/reports/cofounder_search_lab_report_2026-04-22.json`
- `PlacedOn/training/reports/cofounder_search_lab_summary_2026-04-22.md`
- `PlacedOn/training/reports/cofounder_search_best_config_2026-04-22.json`

## 1. Ten-Minute Training Run

Runtime configuration:

- Runtime seconds: `600`
- Episodes per trial: `4`
- Max turns per episode: `6`
- Seed: `42`

Main output:

- Trials completed: `12557`
- Best reward: `0.8235`
- Best selection accuracy: `1.0`
- Best psychometric MAE: `0.2173`
- Best solve rate: `0.5312`

Interpretation:

- The model reached perfect co-founder selection on its best configuration during the timed sweep.
- The strongest runs balanced candidate discovery with psychometric consistency instead of optimizing reward alone.
- The search exercised every configured value in the parameter grid, so this was a real coverage sweep rather than a narrow benchmark replay.

## 2. Best Parameter Set

```json
{
  "max_consecutive_per_skill": 3,
  "max_probes_per_skill": 2,
  "max_retries_per_skill": 1,
  "max_turns_per_skill": 3,
  "total_turn_limit": 6,
  "target_sigma2": 0.14,
  "process_noise_q": 0.002,
  "measurement_noise_r_base": 0.14,
  "strategic_probe_score_floor": 0.45,
  "strategic_probe_score_ceiling": 0.78,
  "strategic_probe_missing_threshold": 1
}
```

Parameter coverage reached:

- `max_consecutive_per_skill`: `[2, 3]`
- `max_probes_per_skill`: `[1, 2, 3]`
- `max_retries_per_skill`: `[1, 2]`
- `max_turns_per_skill`: `[3, 4, 5]`
- `total_turn_limit`: `[6, 8, 10]`
- `target_sigma2`: `[0.14, 0.18, 0.22, 0.26]`
- `process_noise_q`: `[0.002, 0.005, 0.008]`
- `measurement_noise_r_base`: `[0.14, 0.2, 0.26]`
- `strategic_probe_score_floor`: `[0.45, 0.52, 0.6]`
- `strategic_probe_score_ceiling`: `[0.72, 0.78, 0.84]`
- `strategic_probe_missing_threshold`: `[1, 2]`

## 3. Hardest Founder-Fit Vectors

The weakest psychometric dimensions in the best run were:

- `block_10_calibration` mean error `0.639`
- `block_8_ownership` mean error `0.396`
- `block_6_social` mean error `0.2325`

What that means:

- The model is still weaker when founder-fit depends on calibration under ambiguity.
- Ownership and trust remain harder than pure pattern-matching or surface fluency.
- Future training should keep targeting nuanced trade-off reasoning instead of just increasing question volume.

## 4. Decision From CTO / CPO / Head of AI

What should ship now:

1. Keep the production brain separate from this lab until the founder-search benchmark stays strong across more scenario families.
2. Promote only the uncertainty and strategic-probe improvements that generalize well.
3. Use the co-founder search lab as the main tuning harness for the thinking model.

What should happen next:

1. Expand candidate archetypes for adversarial charm, deceptive confidence, and inconsistent ownership.
2. Add scenario packs for fundraising pressure, enterprise sales trust, and zero-to-one product pivots.
3. Raise the pass bar on calibration and ownership before considering any tighter coupling with the live interview brain.
