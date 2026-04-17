import argparse
import asyncio
import json
import uuid

import websockets


async def receive_until_question(ws: websockets.WebSocketClientProtocol) -> dict:
    while True:
        raw = await ws.recv()
        payload = json.loads(raw)
        print("<-", payload)
        if payload.get("type") == "question":
            return payload


async def run(url: str, interview_id: str) -> None:
    ws_url = f"{url.rstrip('/')}/ws/{interview_id}".replace("http://", "ws://").replace(
        "https://", "wss://"
    )

    print(f"Connecting to {ws_url}")
    async with websockets.connect(ws_url) as ws:
        await receive_until_question(ws)

        message_id = str(uuid.uuid4())
        first_answer = {
            "type": "answer",
            "message_id": message_id,
            "content": "I designed a resilient event-driven platform with retries and tracing.",
        }
        print("->", first_answer)
        await ws.send(json.dumps(first_answer))
        await receive_until_question(ws)

        duplicate = {
            "type": "answer",
            "message_id": message_id,
            "content": "I designed a resilient event-driven platform with retries and tracing.",
        }
        print("->", duplicate)
        await ws.send(json.dumps(duplicate))
        print("<-", json.loads(await ws.recv()))

    print("Disconnected intentionally. Reconnecting...")

    async with websockets.connect(ws_url) as ws:
        await receive_until_question(ws)
        second_answer = {
            "type": "answer",
            "message_id": str(uuid.uuid4()),
            "content": "For reconnection I preserve interview state in Redis with strict idempotency.",
        }
        print("->", second_answer)
        await ws.send(json.dumps(second_answer))
        await receive_until_question(ws)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Manual WebSocket client for interview backbone")
    parser.add_argument("--url", default="http://127.0.0.1:8000", help="Base server URL")
    parser.add_argument("--interview-id", default="manual-interview", help="Interview ID")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    asyncio.run(run(url=args.url, interview_id=args.interview_id))
