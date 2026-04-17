from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.config import Settings
from app.models import InterviewState
from app.websocket_router import router


class InMemorySessionManager:
    def __init__(self) -> None:
        self.storage: dict[str, InterviewState] = {}

    async def get_state(self, interview_id: str) -> InterviewState | None:
        return self.storage.get(interview_id)

    async def set_state(self, state: InterviewState) -> None:
        self.storage[state.interview_id] = state


def _receive_final_question(ws, max_frames: int = 400) -> dict:
    for _ in range(max_frames):
        payload = ws.receive_json()
        if payload.get("type") == "question":
            return payload
    raise AssertionError("No final question frame received")


def _build_test_app(manager: InMemorySessionManager) -> FastAPI:
    app = FastAPI()
    app.include_router(router)
    app.state.session_manager = manager
    app.state.settings = Settings(stream_delay_seconds=0.0)
    return app


def test_websocket_connect_send_answer_and_receive_response() -> None:
    manager = InMemorySessionManager()
    app = _build_test_app(manager)

    with TestClient(app) as client:
        with client.websocket_connect("/ws/interview-1") as ws:
            first_question = _receive_final_question(ws)
            assert first_question["turn"] == 1

            ws.send_json(
                {
                    "type": "answer",
                    "message_id": "msg-1",
                    "content": "I use retries, tracing, and postmortem action items.",
                }
            )

            second_question = _receive_final_question(ws)
            assert second_question["turn"] == 2
            assert isinstance(second_question["content"], str)
            assert second_question["content"].strip()


def test_disconnect_reconnect_and_duplicate_idempotency() -> None:
    manager = InMemorySessionManager()
    app = _build_test_app(manager)

    with TestClient(app) as client:
        with client.websocket_connect("/ws/interview-2") as ws:
            _ = _receive_final_question(ws)
            ws.send_json(
                {
                    "type": "answer",
                    "message_id": "dup-1",
                    "content": "I focus on latency budgets and bottleneck isolation.",
                }
            )
            question_after_answer = _receive_final_question(ws)
            assert question_after_answer["turn"] == 2

        with client.websocket_connect("/ws/interview-2") as ws_reconnect:
            resent = _receive_final_question(ws_reconnect)
            assert resent["turn"] == 2

            ws_reconnect.send_json(
                {
                    "type": "answer",
                    "message_id": "dup-1",
                    "content": "I focus on latency budgets and bottleneck isolation.",
                }
            )
            duplicate = ws_reconnect.receive_json()
            assert duplicate["type"] == "duplicate"

            saved = manager.storage["interview-2"]
            assert saved.turn == 2
            assert saved.last_message_id == "dup-1"
