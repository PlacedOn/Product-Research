from __future__ import annotations
from typing import Optional
from interaction_layer.config import InteractionConfig
from interaction_layer.models import PresenceState


class PresenceMonitor:
    def __init__(self, config:Optional[ InteractionConfig] = None) -> None:
        self._config = config or InteractionConfig()

    async def snapshot(self, camera_active: bool, tab_focused: bool, response_latency_ms: int) -> PresenceState:
        present = camera_active or tab_focused
        active = tab_focused and response_latency_ms <= self._config.presence_latency_warn_ms
        return PresenceState(
            present=present,
            active=active,
            camera_active=camera_active,
            tab_focused=tab_focused,
            response_latency_ms=response_latency_ms,
        )
