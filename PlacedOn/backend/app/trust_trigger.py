"""
PlacedOn — 5-Minute Trust Trigger

Fires once per interview at the 5-minute mark, sending the candidate
a preview of their strongest HCV block. This reduces drop-off by
showing real value during the interview (not just at the end).
"""

from __future__ import annotations

import json
import time
from typing import Any

from starlette.websockets import WebSocket


async def check_and_fire_trust_trigger(
    websocket: WebSocket,
    session_state: dict[str, Any],
) -> bool:
    """Check if 5 minutes have passed and fire the trust preview event.

    Returns True if the event was fired, False otherwise.
    """
    if session_state.get("trust_trigger_fired"):
        return False

    start_time = session_state.get("start_time")
    if start_time is None:
        return False

    elapsed = time.time() - start_time
    if elapsed < 300:  # 5 minutes
        return False

    hcv_state = session_state.get("hcv_vectors", {})
    if not hcv_state:
        return False

    # Find the block with lowest uncertainty (highest confidence)
    best_block_name = None
    best_block_data = None
    lowest_sigma = float("inf")

    for block_name, block_data in hcv_state.items():
        sigma = block_data.get("sigma", float("inf"))
        if sigma < lowest_sigma:
            lowest_sigma = sigma
            best_block_name = block_name
            best_block_data = block_data

    if best_block_name is None:
        return False

    preview_event = {
        "type": "hcv_preview",
        "block": best_block_name,
        "score": round(best_block_data.get("score", 0.0), 2),
        "sigma": round(lowest_sigma, 2),
    }

    await websocket.send_text(json.dumps(preview_event))
    session_state["trust_trigger_fired"] = True
    return True
