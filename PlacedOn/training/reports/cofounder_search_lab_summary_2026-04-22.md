# Co-Founder Search Lab

This report captures the timed founder-search simulation for the thinking model.

## Key Result

- Runtime seconds: `600`
- Trials completed: `12557`
- Best average reward: `0.8235`
- Best selection accuracy: `1.0`
- Best psychometric MAE: `0.2173`
- Best solve rate: `0.5312`

## Best Config

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

Saved config artifact: `/Users/nishantsingh/Documents/New project/product-research/PlacedOn/training/reports/cofounder_search_best_config_2026-04-22.json`

## Hardest Vectors

- `block_10_calibration` mean error `0.639`
- `block_8_ownership` mean error `0.396`
- `block_6_social` mean error `0.2325`

## CTO Decision

- Keep the production brain stable and use this lab as the tuning surface for the thinking model.
- Promote only configs that improve co-founder selection accuracy and psychometric MAE together.
- Focus the next iteration on the hardest vectors rather than chasing raw reward alone.

## CPO Decision

- Treat the hidden co-founder search as a founder-fit evaluation workflow, not a generic interview loop.
- Preserve evidence-rich probing on leadership, ownership, calibration, and trust before final recommendation.

## AI / ML Decision

- Continue timed parameter sweeps across uncertainty, probe, and retry parameters.
- Use scenario families with different startup stresses so the model does not overfit one founder archetype.
