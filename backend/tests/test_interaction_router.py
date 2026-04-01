from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.config import Settings
from app.interaction_router import router
from app.live_runtime import LiveInterviewRuntime
from app.models import InterviewState


class InMemorySessionManager:
    def __init__(self) -> None:
        self.storage: dict[str, InterviewState] = {}

    async def get_state(self, interview_id: str) -> InterviewState | None:
        return self.storage.get(interview_id)

    async def set_state(self, state: InterviewState) -> None:
        self.storage[state.interview_id] = state


def _build_test_app(manager: InMemorySessionManager) -> FastAPI:
    app = FastAPI()
    app.include_router(router)
    app.state.session_manager = manager
    app.state.settings = Settings(stream_delay_seconds=0.0)
    app.state.live_runtime = LiveInterviewRuntime()
    return app


def test_process_turn_endpoint_links_with_backend_runtime() -> None:
    manager = InMemorySessionManager()
    app = _build_test_app(manager)

    with TestClient(app) as client:
        response = client.post(
            "/process-turn",
            json={
                "session_id": "int-1",
                "turn_index": 1,
                "transcript": "I use cache ttl and event invalidation.",
            },
        )

    assert response.status_code == 200
    body = response.json()
    assert isinstance(body["response_text"], str)
    assert body["response_text"].strip()
    assert "int-1" in manager.storage


def test_interaction_websocket_streams_persona_and_audio() -> None:
    manager = InMemorySessionManager()
    app = _build_test_app(manager)

    with TestClient(app) as client:
        with client.websocket_connect("/interaction/ws/int-2") as ws:
            first = ws.receive_json()
            assert first["type"] == "backend_question"

            ws.send_json(
                {
                    "type": "audio",
                    "chunk_id": 1,
                    "content": "I use queue backpressure and idempotency keys",
                    "is_final": True,
                }
            )

            seen_types: set[str] = set()
            for _ in range(120):
                frame = ws.receive_json()
                seen_types.add(frame.get("type", ""))
                if "audio_frame" in seen_types and "persona_token" in seen_types:
                    break

    assert "stt_final" in seen_types
    assert "persona_token" in seen_types
    assert "audio_frame" in seen_types
