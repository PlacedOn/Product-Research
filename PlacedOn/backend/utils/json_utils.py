from __future__ import annotations
import json


def extract_json(text: str) -> dict:
    start = text.find("{")
    end = text.rfind("}") + 1
    if start < 0 or end <= start:
        raise ValueError("No JSON object found in text")
    return json.loads(text[start:end])
