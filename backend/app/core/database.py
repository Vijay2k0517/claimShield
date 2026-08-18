import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger("claimshield.database")


class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False

    async def connect(self):
        """Initialize MongoDB connection pool."""
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000
            )
            self.db = self.client[settings.MONGODB_DB_NAME]
            # Verify connection with a ping
            await self.client.admin.command("ping")
            self.is_connected = True
            logger.info(f"Successfully connected to MongoDB database: {settings.MONGODB_DB_NAME}")
        except Exception as e:
            self.is_connected = False
            logger.warning(
                f"MongoDB connection failed: {e}. "
                f"Backend will start with database in offline mode. Please ensure MongoDB is running."
            )

    async def disconnect(self):
        """Close MongoDB connection pool."""
        if self.client is not None:
            logger.info("Closing MongoDB connection...")
            self.client.close()
            self.is_connected = False
            logger.info("MongoDB connection closed.")

    async def check_health(self) -> dict:
        """Check the status of MongoDB connectivity."""
        if not self.client:
            return {"status": "disconnected", "database": settings.MONGODB_DB_NAME, "error": "Client not initialized"}
        try:
            await self.client.admin.command("ping")
            self.is_connected = True
            return {"status": "healthy", "database": settings.MONGODB_DB_NAME}
        except Exception as e:
            self.is_connected = False
            return {"status": "unhealthy", "database": settings.MONGODB_DB_NAME, "error": str(e)}

    def get_database(self) -> Optional[AsyncIOMotorDatabase]:
        return self.db

    def get_collection(self, name: str):
        if self.db is not None:
            return self.db[name]
        return None


db_manager = DatabaseManager()


def get_db() -> Optional[AsyncIOMotorDatabase]:
    """Dependency helper to get the database instance."""
    return db_manager.get_database()
