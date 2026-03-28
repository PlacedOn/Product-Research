# Layer 1: State & Communication Backbone

Production-grade backend infrastructure for a real-time AI interview system.

## What is implemented

- FastAPI WebSocket endpoint at `/ws/{interview_id}`
- Redis-backed async session state manager with TTL
- State compression with strict <= 400 character output
- Reconnection behavior using persisted interview state
- Idempotency via `message_id`
- Streaming simulation using token-by-token WebSocket frames
- Mock LLM question generation (no external API calls)
- Automated tests for websocket/session/compression/idempotency

## Project structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── main.py
│   ├── models.py
│   ├── session_manager.py
│   ├── state_compressor.py
│   ├── utils.py
│   └── websocket_router.py
├── manual_ws_client.py
├── requirements.txt
├── tests/
│   ├── test_compression.py
│   ├── test_session.py
│   └── test_websocket.py
└── README.md
```

## State model

Redis key format:

- `interview:{interview_id}`

Stored schema:

```json
{
  "interview_id": "str",
  "turn": 1,
  "last_question": "str",
  "last_answer": "str|null",
  "skill_vector": [0.1, 0.2, 0.3],
  "performance": {"clarity": 80.5},
  "last_message_id": "str|null"
}
```

## WebSocket protocol

Incoming client message:

```json
{
  "type": "answer",
  "message_id": "uuid",
  "content": "user answer"
}
```

Primary outgoing message:

```json
{
  "type": "question",
  "content": "next question",
  "turn": 2
}
```

Streaming frames are also sent as:

```json
{
  "type": "question_token",
  "content": "token ",
  "turn": 2
}
```

Duplicate `message_id` response:

```json
{
  "type": "duplicate",
  "message_id": "uuid",
  "detail": "Message already processed"
}
```

## Setup

### 1) Create virtual environment and install dependencies

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2) Start Redis

Choose one:

```bash
redis-server
```

or Docker:

```bash
docker run --rm -p 6379:6379 redis:7
```

### 3) Configure environment (optional)

```bash
export REDIS_URL="redis://localhost:6379/0"
export SESSION_TTL_SECONDS="1800"
export STREAM_DELAY_SECONDS="0.05"
export INITIAL_QUESTION="Tell me about a backend system you designed recently."
```

### 4) Run server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

Expected:

```json
{"status":"ok"}
```

## Automated tests

Run from `backend/`:

```bash
python3 -m pytest -q
```

Expected:

- `5 passed`

## Manual test script

Run from `backend/` while server is running:

```bash
python3 manual_ws_client.py --url http://127.0.0.1:8000 --interview-id demo-1
```

What this script simulates:

1. **Normal flow**: connect, receive initial question, send answer, receive next question
2. **Duplicate message**: sends same `message_id` twice, expects `type=duplicate`
3. **Disconnect + reconnect**: reconnects with same `interview_id` and resumes state
4. **Continue after reconnect**: sends a new answer and gets next question

## Edge cases handled

- Mid-stream disconnect: server catches `WebSocketDisconnect` and cleans connection registry
- Multiple active sockets per `interview_id`: older socket is closed when a new one connects
- Missing state: interview is initialized with default opening question
- Reconnect recovery:
  - if `last_answer` missing, resend `last_question`
  - otherwise continue from current state
- Idempotency: duplicate `message_id` does not mutate state or advance turn

## Notes

- No external LLM call is made; question generation is local and deterministic.
- Session state is persisted before sending the next question to support robust recovery.
