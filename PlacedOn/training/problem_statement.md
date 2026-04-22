# Problem Statement: Recursive Active Learning Simulation Room

## The Core Challenge: "Questioning Everything"
In a highly deterministic interviewing environment, rigid heuristics can cause an AI to decay into repetitive, loop-bound patterns when it encounters unexpected candidate data. The fundamental problem is: **How can a system recursively question its own assumptions and continuously learn from simulated encounters without halting or silently overfitting to a narrow answer style?**

If the AI trusts its initial assessment without reflection, it risks compounding errors. The AI must question every input, every fallback state, every uncertainty metric, and every case where polished language is mistaken for real understanding.

## Proposed Strategy: 60-Minute Simulation Room With Trial-and-Error Learning
To solve this, we use an accelerated simulation room that represents a 60-minute evaluation window while running faster than wall-clock time. The loop is built around measurable error, mistake analysis, and safe parameter updates instead of autonomous source-code rewriting.

### 1. Accelerated Interview Farming
- Simulate multiple candidate archetypes across a 60-minute virtual room.
- Generate adaptive interview trajectories with the AoT orchestrator.
- Convert each trajectory into embeddings, skill aggregates, and prediction targets.

### 2. Truth Signal and Error Measurement
By mapping candidate responses to a semantic embedding field, we project assumed traits against ground-truth archetype traits. We model this as a regression problem.
- **Primary metric:** Mean Absolute Error (MAE)
- **Secondary signals:** archetype-specific error, mistake count, and overconfidence failures
- **Gate:** bad rounds are not treated as success just because training completes

### 3. Trial-and-Error Update Rule
- After each round, identify where the interviewer was fooled.
- Oversample hard archetypes in the next round.
- Retrain the prediction model on the accumulated simulation memory.
- Persist reports and patch recommendations, but do **not** auto-edit production code.

### 4. Safety Constraint
The model may update learned parameters and sampling priorities from simulation mistakes, but it must not silently rewrite source files at runtime. Any code changes should remain human-reviewed and auditable.

## Success Criteria
- Full test suite passes before and after the simulation run.
- Simulation produces a report with MAE over multiple rounds.
- Hard archetypes (for example, polished but shallow candidates) are revisited more often after they trigger mistakes.
- Model artifacts and logs are reproducible from CLI inputs.
