from typing import Any

try:
    from redis.asyncio import Redis
except ModuleNotFoundError:  # pragma: no cover - fallback for minimal test environments
    Redis = Any

from app.models import InterviewState


class SessionManager:
    def __init__(self, redis_client: Redis, ttl_seconds: int = 1800) -> None:
        self._redis = redis_client
        self._ttl_seconds = ttl_seconds

    @classmethod
    async def create(cls, redis_url: str, ttl_seconds: int = 1800) -> "SessionManager":
        if Redis is Any:
            raise RuntimeError(
                "redis package is required for SessionManager.create(). Install dependencies from requirements.txt"
            )
        redis_client = Redis.from_url(redis_url, decode_responses=True)
        return cls(redis_client=redis_client, ttl_seconds=ttl_seconds)

    @staticmethod
    def _key(interview_id: str) -> str:
        return f"interview:{interview_id}"

    async def get_state(self, interview_id: str) -> InterviewState | None:
        raw = await self._redis.get(self._key(interview_id))
        if raw is None:
            return None
        return InterviewState.model_validate_json(raw)

    async def set_state(self, state: InterviewState) -> None:
        await self._redis.set(
            self._key(state.interview_id),
            state.model_dump_json(),
            ex=self._ttl_seconds,
        )

    async def update_state(self, interview_id: str, **updates: object) -> InterviewState:
        current_state = await self.get_state(interview_id)
        if current_state is None:
            current_state = InterviewState(interview_id=interview_id)

        next_state = current_state.model_copy(update=updates)
        await self.set_state(next_state)
        return next_state

    async def ttl(self, interview_id: str) -> int:
        return int(await self._redis.ttl(self._key(interview_id)))

    async def close(self) -> None:
        await self._redis.aclose()
