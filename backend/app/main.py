from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import get_settings
from app.live_runtime import LiveInterviewRuntime
from app.session_manager import SessionManager
from app.websocket_router import router as websocket_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.settings = settings
    app.state.live_runtime = LiveInterviewRuntime()
    app.state.session_manager = await SessionManager.create(
        redis_url=settings.redis_url,
        ttl_seconds=settings.session_ttl_seconds,
    )
    try:
        yield
    finally:
        await app.state.session_manager.close()


app = FastAPI(title="AI Interview Backbone", lifespan=lifespan)
app.include_router(websocket_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
