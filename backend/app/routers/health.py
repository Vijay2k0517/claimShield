from fastapi import APIRouter
from app.core.config import settings
from app.core.database import db_manager
import time

router = APIRouter(tags=["Health & Status"])

START_TIME = time.time()


@router.get("/health", summary="Health Check")
async def health_check():
    """
    Returns the health status of the ClaimShield AI Backend API and MongoDB database.
    """
    uptime_seconds = round(time.time() - START_TIME, 2)
    db_health = await db_manager.check_health()
    
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "uptime_seconds": uptime_seconds,
        "database": db_health
    }
