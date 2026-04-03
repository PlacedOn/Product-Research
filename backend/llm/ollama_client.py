import logging
from typing import Any

import requests

logger = logging.getLogger(__name__)


class OllamaError(Exception):
    pass


def call_ollama(prompt: str, model: str = "llama3", options: dict[str, Any] | None = None) -> str:
    logger.info("[OLLAMA] request sent")
    try:
        payload: dict[str, Any] = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
        }
        if options:
            payload["options"] = options

        response = requests.post(
            "http://localhost:11434/api/generate",
            json=payload,
            timeout=30,
        )

        if response.status_code != 200:
            raise OllamaError(f"HTTP {response.status_code}")

        logger.info("[OLLAMA] response received")
        return response.json()["response"].strip()
    except Exception as exc:  # noqa: BLE001
        logger.error("[OLLAMA ERROR] %s", exc)
        raise
