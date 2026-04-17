# Layer 4: Atom of Thoughts (AoT) Orchestrator

Adaptive interview orchestration layer for an AI interview system using deterministic control + mock LLM tools.

## Features

- Controller at start and end of each turn
- Uncertainty-driven skill decomposition (`max(sigma^2)`)
- Constrained question generation by skill/difficulty/mode
- Strict judge logic with explicit evidence extraction and anti-hallucination policy
- Full async orchestrator loop with `probe`, `retry`, and `move` transitions
- Hard limits enforced:
  - max 2 consecutive turns per skill
  - max 2 probes per skill
  - max 2 retries per skill
  - max turns per skill configurable (default 4)

## Project structure

```text
aot_layer/
├── __init__.py
├── config.py
├── controller.py
├── decomposer.py
├── generator.py
├── judge.py
├── mock_llm.py
├── models.py
├── orchestrator.py
├── tests/
│   ├── test_controller.py
│   ├── test_flow.py
│   └── test_judge.py
├── main.py
└── README.md
```

## Core design

### Controller

- Start:
  - picks decomposer suggestion unless balancing rules require rotation
  - computes difficulty from uncertainty
- End:
  - `partial` + probe allowed => `probe`
  - `wrong` + retry allowed => `retry`
  - otherwise => `move` to balanced next skill

### Decomposer

- Selects skill with highest `sigma^2`.

### Generator (mock LLM)

- Deterministic templates by mode:
  - `new`: fresh scenario
  - `probe`: deeper follow-up
  - `retry`: hint-oriented phrasing

### Judge (strict)

Implemented as explicit steps:

1. Extract explicit evidence from answer text
2. Identify missing required concepts
3. Classify (`correct`, `partial`, `wrong`)
4. Assign confidence (`0.0–1.0`)
5. Decide probe/recovery flags

Rule: no inferred knowledge; only explicit keyword evidence counts.

## Running the demo

From repo root:

```bash
python3 aot_layer/main.py
```

Or from inside `aot_layer/`:

```bash
python3 main.py
```

You should see logs similar to:

```text
[Controller] Target skill: caching | mode=new
[Judge] direction=partial, confidence=0.67 -> probe
```

Demo includes:

- partial answer -> probe flow
- wrong answer -> retry flow
- correct answer -> move to next skill

## Tests

Run:

```bash
python3 -m pytest -q aot_layer/tests
```

Coverage includes:

- full flow transitions (probe/retry/move in 3–5 turns)
- controller limits (max probes/retries + skill rotation)
- judge behavior for partial/wrong/correct
- edge case: repeated wrong answers force move
- edge case: high confidence answer avoids probing
