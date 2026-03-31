# Full-Stack Layer Integration (L1-L5)

This package links all existing interview layers into one coherent runtime pipeline.

## Architecture

```text
Layer 1 (Transport)
  WebSocket session + idempotency + state persistence

Layer 4 (Question strategy)
  AoT controller/decomposer/generator decides skill + mode + difficulty
  -> raw question

Layer 3 (Safety guardrails)
  Bias classifier checks raw question
  -> approved OR fallback safe question (with re-validation)

Candidate Answer
  -> Layer 2 assessment

Layer 2 (Assessment extractors)
  Capability adapter + AST evaluator + behavioral signals
  -> structured skill/embedding/behavioral output

Layer 3 (Behavioral integrity)
  Uses Layer 2 embedding history + behavioral signals
  -> trust_score + anomaly_flag (probabilistic only)

Layer 4 (Adaptive progression)
  Judge result confidence is trust-adjusted
  Controller decides probe/retry/move

Layer 5 (Persistence + profile)
  Turn-wise signals aggregated to candidate state
  Fit matching and profile rendering
```

## Implemented integration

- `interview_system/orchestrator.py`
  - orchestrates Layer 4 questioning loop
  - enforces Layer 3 safety on every question before candidate sees it
  - runs Layer 2 extraction on every answer
  - computes Layer 3 trust signal from Layer 2 outputs
  - applies trust-adjusted confidence into Layer 4 state progression
  - maps Layer 2 outputs into Layer 5 turn signals, aggregates and stores candidate state
  - runs fit matching and profile rendering

- `interview_system/models.py`
  - `InterviewTurnTrace`: per-turn cross-layer trace
  - `FullStackResult`: unified output with final state + profile + fit

## Why this is compatible

- Layer 2 uses variable-length embeddings.
- Layer 5 aggregation requires fixed dimensions per interview session.
- Integrator fixes this by using first-turn embedding size as session target and applies deterministic pad/truncate mapping per turn.

## Usage

Run manual demo:

```bash
python3 interview_system/main.py
```

Run integration tests:

```bash
python3 -m pytest -q interview_system/tests
```

## Layer 1 wiring note

Layer 1 transport already handles websocket/session lifecycle. To fully activate integrated runtime in live websocket flow, call `FullStackInterviewOrchestrator.run(...)` from the backend interview loop using your real answer-provider callback.
