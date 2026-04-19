import math
import re
from collections import Counter
from hashlib import blake2b

_DIMENSION = 64

_ALIASES = {
    "persisted": "persistent",
    "persevered": "persistent",
    "ownership": "owned",
    "owned": "owned",
    "leader": "leadership",
    "leading": "leadership",
    "collaborative": "collaboration",
    "collaborated": "collaboration",
    "teammate": "team",
    "stakeholders": "stakeholder",
    "resilient": "resilience",
    "stressful": "stress",
    "learned": "learning",
    "curious": "curiosity",
    "validated": "validate",
}


def _tokens(text: str) -> list[str]:
    tokens = re.findall(r"[a-zA-Z0-9_]+", text.lower())
    normalized = [_ALIASES.get(token, token) for token in tokens]
    bigrams = [
        f"{normalized[idx]}_{normalized[idx + 1]}"
        for idx in range(len(normalized) - 1)
    ]
    return normalized + bigrams


async def embed_text(text: str) -> list[float]:
    tokens = _tokens(text)
    if not tokens:
        return [0.0] * _DIMENSION

    counts = Counter(tokens)
    values = [0.0] * _DIMENSION
    for token, count in counts.items():
        digest = blake2b(token.encode("utf-8"), digest_size=8).digest()
        bucket = int.from_bytes(digest[:4], "big") % _DIMENSION
        sign = -1.0 if digest[4] % 2 else 1.0
        weight = (1.0 + math.log1p(count)) * (1.35 if "_" in token else 1.0)
        values[bucket] += sign * weight

    return _l2_normalize(values)


def cosine_similarity(left: list[float], right: list[float]) -> float:
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
    return 1.0 - ((cosine_similarity(left, right) + 1.0) / 2.0)


def _l2_normalize(vector: list[float]) -> list[float]:
    norm = math.sqrt(sum(value * value for value in vector))
    if norm <= 0:
        return vector
    return [value / norm for value in vector]
