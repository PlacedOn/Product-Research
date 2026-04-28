from __future__ import annotations
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .session_manager import SessionManager
from .api_routes import router as api_router
from .demo_routes import router as demo_router

try:
    from .interaction_router import router as interaction_router
    from .live_runtime import LiveInterviewRuntime
    from .websocket_router import router as websocket_router
except ModuleNotFoundError as exc:  # pragma: no cover - exercised in minimal demo/test environments
    interaction_router = None
    websocket_router = None
    LiveInterviewRuntime = None
    _runtime_import_error = exc
else:
    _runtime_import_error = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.settings = settings
    app.state.runtime_import_error = _runtime_import_error
    app.state.live_runtime = LiveInterviewRuntime() if LiveInterviewRuntime is not None else None
    app.state.session_manager = await SessionManager.create(
        redis_url=settings.redis_url,
        ttl_seconds=settings.session_ttl_seconds,
    )
    try:
        yield
    finally:
        await app.state.session_manager.close()


app = FastAPI(title="AI Interview Backbone", lifespan=lifespan)
_settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=_settings.cors_allow_origins,
    allow_origin_regex=_settings.cors_allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if websocket_router is not None:
    app.include_router(websocket_router)
if interaction_router is not None:
    app.include_router(interaction_router)
app.include_router(api_router)
app.include_router(demo_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
