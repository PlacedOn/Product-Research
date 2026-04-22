from __future__ import annotations
"""
PlacedOn Layer 2 — Semantic Embedding Engine

Replaces the broken blake2b hash-based embedding with real
sentence-transformers SBERT (all-MiniLM-L6-v2).

Output: 384-dimensional semantic vectors that actually understand meaning.
"""


import asyncio
import math
from functools import lru_cache

from sentence_transformers import SentenceTransformer

_MODEL_NAME = "all-MiniLM-L6-v2"
_DIMENSION = 384


@lru_cache(maxsize=1)
def _load_model() -> SentenceTransformer:
    """Load SBERT model once and cache it in memory."""
    return SentenceTransformer(_MODEL_NAME)


async def embed_text(text: str) -> list[float]:
    """Generate a 384-dim semantic embedding for the given text."""
    text = (text or "").strip()
    if not text:
        return [0.0] * _DIMENSION

    model = _load_model()
    vector = await asyncio.to_thread(model.encode, text)
    return vector.tolist()


def cosine_similarity(left: list[float], right: list[float]) -> float:
    """Compute cosine similarity between two vectors."""
    if not left or not right:
        return 0.0

    max_len = max(len(left), len(right))
    l = left + [0.0] * (max_len - len(left))
    r = right + [0.0] * (max_len - len(right))

    dot = sum(a * b for a, b in zip(l, r))
    norm_l = math.sqrt(sum(a * a for a in l))
    norm_r = math.sqrt(sum(b * b for b in r))

    if norm_l == 0.0 or norm_r == 0.0:
        return 0.0

    score = dot / (norm_l * norm_r)
    return max(-1.0, min(score, 1.0))


def cosine_distance(left: list[float], right: list[float]) -> float:
    """Cosine distance normalized to [0, 1]."""
    return 1.0 - ((cosine_similarity(left, right) + 1.0) / 2.0)
