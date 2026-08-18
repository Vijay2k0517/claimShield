from app.routers.health import router as health_router
from app.routers.evidence import router as evidence_router
from app.routers.ai import router as ai_router
from app.routers.similarity import router as similarity_router
from app.routers.claims import router as claims_router
from app.routers.analytics import router as analytics_router

__all__ = [
    "health_router",
    "evidence_router",
    "ai_router",
    "similarity_router",
    "claims_router",
    "analytics_router",
]
