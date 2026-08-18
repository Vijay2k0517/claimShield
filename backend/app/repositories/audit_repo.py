import logging
from typing import List, Optional, Dict, Any
import re
from pymongo import DESCENDING
from app.core.database import db_manager

logger = logging.getLogger("claimshield.audit_repo")


class AuditRepository:
    def __init__(self):
        self._memory_logs: List[Dict[str, Any]] = []

    @property
    def collection(self):
        return db_manager.get_collection("audit_logs")

    async def create_audit_entry(self, audit_data: Dict[str, Any]) -> Dict[str, Any]:
        """Records an audit log entry for human decision vs AI prediction."""
        audit_data.pop("_id", None)
        self._memory_logs.insert(0, dict(audit_data))

        col = self.collection
        if col is not None:
            try:
                await col.insert_one(dict(audit_data))
            except Exception as e:
                logger.warning(f"MongoDB write failed for audit log: {e}")

        return audit_data

    async def get_audit_history(
        self,
        claim_id: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Retrieves audit trail entries."""
        col = self.collection
        if col is not None:
            try:
                query: Dict[str, Any] = {}
                if claim_id:
                    query["claim_id"] = {"$regex": f"^{re.escape(claim_id)}$", "$options": "i"}

                cursor = col.find(query, {"_id": 0}).sort("timestamp", DESCENDING).limit(limit)
                return await cursor.to_list(length=limit)
            except Exception as e:
                logger.warning(f"MongoDB read failed for audit history: {e}")

        # In-memory fallback
        logs = list(self._memory_logs)
        if claim_id:
            logs = [l for l in logs if l.get("claim_id", "").upper() == claim_id.upper()]
        return logs[:limit]


audit_repository = AuditRepository()
