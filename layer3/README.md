# Layer 3: Anti-Cheat & Safety Guardrails

Layer 3 adds lightweight, explainable guardrails between Layer 2 signals and Layer 4 question flow.

This layer focuses on:

- probabilistic behavioral integrity scoring (not cheating detection)
- embedding + classifier based question safety checks
- deterministic fallback question generation
- mandatory re-validation after fallback

## Components

### `integrity.py` — Behavioral Integrity Engine

Input:

- embedding history from Layer 2
- `consistency_score`
- `drift_score`
- `confidence_signal`

Logic:

- computes embedding drift via cosine distance between consecutive embeddings
- combines embedding drift with Layer 2 drift signal
- computes normalized trust score:

```text
trust = 0.45 * consistency + 0.35 * (1 - drift) + 0.20 * confidence
```

Output:

```json
{
  "trust_score": 0.65,
  "anomaly_flag": false
}
```

`anomaly_flag` is a soft signal for behavioral instability. It does **not** claim cheating.

### `bias_classifier.py` — Bias Enforcer

- uses `HashingVectorizer` embeddings + `LogisticRegression`
- no LLM calls
- no rule-based decision system
- deterministic training data and random state

Output:

```json
{
  "bias_score": 0.62,
  "approved": false
}
```

### `fallback.py` — Safe Fallback + Re-validation

Flow:

1. classify generated question
2. if unsafe, generate skill/difficulty-aware fallback question
3. classify fallback question again
4. if still unsafe, use generic safe question:
   - `Can you explain your approach to solving this problem?`

## Integration Contracts

### Layer 2 -> Layer 3

Map `layer2` outputs into `IntegrityInput`:

- `Layer2Output.behavioral_signals.consistency_score`
- `Layer2Output.behavioral_signals.drift_score`
- `Layer2Output.behavioral_signals.confidence_signal`
- embedding history list collected across turns

### Layer 3 -> Layer 4

For each `QuestionOutput` from Layer 4:

- pass `question`, `skill`, `difficulty` to `SafeQuestionPipeline.validate(...)`
- use returned `question` as the final sendable prompt
- optionally feed `trust_score` into controller policy

## File Layout

```text
layer3/
├── integrity.py
├── bias_classifier.py
├── fallback.py
├── models.py
├── config.py
├── tests/
│   ├── test_integrity.py
│   ├── test_bias.py
│   ├── test_fallback.py
│   ├── test_flow.py
├── main.py
└── README.md
```

## Manual Run

From repo root:

```bash
python3 layer3/main.py
```

Example logs:

```text
[Bias] Score: 0.7 -> Rejected
[Fallback] Generated safe question
[Integrity] Trust score: 0.62
```

## Tests

Run:

```bash
python3 -m pytest -q layer3/tests
```

Coverage includes:

- integrity scoring for stable vs unstable embedding behavior
- safe vs unsafe bias classifications
- fallback + generic fallback edge case
- end-to-end flow with unsafe question correction and trust scoring
