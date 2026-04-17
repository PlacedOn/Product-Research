# Interaction & AI Persona Layer Stack

This package implements the real-time interaction stack that sits above backend reasoning layers.

It handles only:

- voice input/output
- session and turn orchestration
- transport streaming
- persona delivery of backend responses
- lightweight presence monitoring
- recovery behavior

It does **not** perform reasoning, scoring, or question generation decisions.

## Boundary

Backend contract used by this layer:

```text
POST /process-turn
```

Input: transcript payload from turn manager.
Output: backend response text.

## Components

- `voice/stt.py`
  - `MockSTT.speech_to_text(audio_chunk)`
  - partial and final transcript support
  - interruption handling

- `voice/tts.py`
  - `MockTTS.text_to_speech(text)` streaming audio frame simulation
  - interruption support

- `communication/websocket_manager.py`
  - websocket connection lifecycle and message delivery

- `session/session_manager.py`
  - session start/end
  - timeout tracking
  - silence detection

- `turn/turn_manager.py`
  - per-turn transcript collection
  - completion detection by final event, explicit stop, or silence threshold
  - backend payload submission

- `monitoring/presence.py`
  - camera/tab/latency snapshot into presence state

- `persona/persona_engine.py`
  - streams backend response tokens
  - sends backend text to TTS
  - no content generation logic

- `error_handling/recovery.py`
  - silence / low-confidence / STT-failure recovery actions

- `main.py`
  - FastAPI routes for simulation
  - websocket real-time loop
  - manual run simulation (`python interaction_layer/main.py`)

## End-to-End Flow

```text
User speaks
-> STT partial/final transcript
-> Turn completion detection
-> POST /process-turn payload
-> backend response text
-> Persona stream
-> TTS audio frames
-> output delivery
```

## Manual Run

From repo root:

```bash
python3 interaction_layer/main.py
```

Expected logs:

```text
[STT] Transcript received
[Turn] Completion detected
[API] Sent to backend
[Persona] Streaming response
[TTS] Audio output generated
```

## Tests

Run:

```bash
python3 -m pytest -q interaction_layer/tests
```

Includes:

- `test_voice.py`
  - STT transcript behavior
  - TTS stream behavior
- `test_session.py`
  - session lifecycle and timeout
- `test_turn.py`
  - completion detection, backend payload, recovery actions
- `test_persona.py`
  - persona only streams backend response and forwards to TTS
- `test_flow.py`
  - full interaction simulation from audio input to TTS output
