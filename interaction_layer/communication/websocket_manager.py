from __future__ import annotations

import asyncio

from fastapi import WebSocket


class WebSocketManager:
    def __init__(self) -> None:
        self._connections: dict[str, WebSocket] = {}
        self._lock = asyncio.Lock()

    async def connect(self, session_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            stale = self._connections.get(session_id)
            self._connections[session_id] = websocket

        if stale is not None and stale is not websocket:
            await stale.close(code=1012, reason="Superseded by new connection")

    async def disconnect(self, session_id: str, websocket: WebSocket) -> None:
        async with self._lock:
            active = self._connections.get(session_id)
            if active is websocket:
                self._connections.pop(session_id, None)

    async def send_json(self, session_id: str, payload: dict) -> None:
        async with self._lock:
            ws = self._connections.get(session_id)
        if ws is not None:
            await ws.send_json(payload)
