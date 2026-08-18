import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.database import db_manager
from app.core.indexes import init_indexes
from app.utils.seed_data import seed_database
from app.routers import health, evidence, ai, similarity, claims, analytics

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s : %(message)s"
)
logger = logging.getLogger("claimshield.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle manager for application startup and shutdown.
    """
    logger.info("Initializing ClaimShield AI Backend services...")
    # Initialize DB connection pool
    await db_manager.connect()
    
    if db_manager.is_connected:
        try:
            # Initialize MongoDB collection indexes
            await init_indexes()
            # Seed canonical claims if database is currently empty
            await seed_database(force=False)
        except Exception as e:
            logger.warning(f"MongoDB post-connection initialization skipped: {e}")
    else:
        logger.info("Operating in resilient in-memory mode (MongoDB offline).")
    
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_PATH, exist_ok=True)
    logger.info(f"Static upload directory ready at: {settings.UPLOAD_PATH}")
    
    yield
    
    logger.info("Shutting down ClaimShield AI Backend services...")
    await db_manager.disconnect()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise AI-Powered Vehicle Insurance Claim Fraud Investigation Platform API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static File Mounting for evidence images and heatmaps
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_PATH)), name="uploads")

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error during request {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "path": request.url.path
        }
    )

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(evidence.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(similarity.router, prefix=settings.API_V1_STR)
app.include_router(claims.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)


@app.get("/", summary="Root Endpoint", tags=["Root"])
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
