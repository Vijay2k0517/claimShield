import logging
from typing import List, Optional, Tuple, Dict, Any
import re
from pymongo import DESCENDING, ASCENDING
from app.core.database import db_manager
from app.models.claim import ClaimFilterParams

logger = logging.getLogger("claimshield.claim_repo")


class ClaimRepository:
    def __init__(self):
        # In-memory store fallback when MongoDB is offline / testing
        self._memory_store: Dict[str, Dict[str, Any]] = {}

    @property
    def collection(self):
        return db_manager.get_collection("claims")

    async def get_next_claim_id(self) -> str:
        """Generates the next sequential claim ID (e.g., CLM006)."""
        col = self.collection
        if col is not None:
            try:
                count = await col.count_documents({})
                return f"CLM{str(count + 1).zfill(3)}"
            except Exception:
                pass
        
        count = len(self._memory_store)
        return f"CLM{str(count + 1).zfill(3)}"

    async def create_claim(self, claim_data: Dict[str, Any]) -> Dict[str, Any]:
        """Inserts a new claim document into MongoDB (or in-memory store)."""
        claim_data.pop("_id", None)
        claim_id = claim_data.get("claim_id", "")

        # Store in-memory
        self._memory_store[claim_id.upper()] = dict(claim_data)

        col = self.collection
        if col is not None:
            try:
                await col.insert_one(dict(claim_data))
            except Exception as e:
                logger.warning(f"MongoDB write failed, preserved in memory: {e}")

        return claim_data

    async def get_claim_by_id(self, claim_id: str) -> Optional[Dict[str, Any]]:
        """Finds a claim by its unique Claim ID (case-insensitive)."""
        col = self.collection
        if col is not None:
            try:
                pattern = re.compile(f"^{re.escape(claim_id)}$", re.IGNORECASE)
                doc = await col.find_one({"claim_id": pattern}, {"_id": 0})
                if doc:
                    return doc
            except Exception as e:
                logger.warning(f"MongoDB read error: {e}")

        # Fallback to memory store
        return self._memory_store.get(claim_id.upper())

    async def get_claims(self, filters: ClaimFilterParams) -> Tuple[List[Dict[str, Any]], int]:
        """
        Queries claims with filtering, multi-attribute search, pagination, and sorting.
        """
        col = self.collection
        if col is not None:
            try:
                query: Dict[str, Any] = {}

                if filters.risk_level:
                    query["risk_level"] = filters.risk_level.value

                if filters.status:
                    query["status"] = filters.status.value

                if filters.vehicle_make:
                    query["vehicle_make"] = {"$regex": re.escape(filters.vehicle_make), "$options": "i"}

                if filters.start_date or filters.end_date:
                    date_filter = {}
                    if filters.start_date:
                        date_filter["$gte"] = filters.start_date
                    if filters.end_date:
                        date_filter["$lte"] = filters.end_date
                    query["submission_date"] = date_filter

                if filters.search:
                    search_str = filters.search.strip()
                    regex = {"$regex": re.escape(search_str), "$options": "i"}
                    query["$or"] = [
                        {"claim_id": regex},
                        {"customer_name": regex},
                        {"vehicle_number": regex},
                        {"vehicle_make": regex},
                        {"vehicle_model": regex},
                        {"policy_id": regex}
                    ]

                total = await col.count_documents(query)
                sort_direction = DESCENDING if filters.sort_order == "desc" else ASCENDING
                sort_field = filters.sort_by or "submission_date"
                skip = (filters.page - 1) * filters.page_size
                limit = filters.page_size

                cursor = col.find(query, {"_id": 0}).sort(sort_field, sort_direction).skip(skip).limit(limit)
                items = await cursor.to_list(length=limit)
                return items, total
            except Exception as e:
                logger.warning(f"MongoDB query failed, falling back to memory: {e}")

        # In-memory querying fallback
        results = list(self._memory_store.values())

        if filters.risk_level:
            results = [r for r in results if r.get("risk_level") == filters.risk_level.value]

        if filters.status:
            results = [r for r in results if r.get("status") == filters.status.value]

        if filters.vehicle_make:
            results = [r for r in results if filters.vehicle_make.lower() in r.get("vehicle_make", "").lower()]

        if filters.search:
            s = filters.search.lower()
            results = [
                r for r in results
                if s in r.get("claim_id", "").lower()
                or s in r.get("customer_name", "").lower()
                or s in r.get("vehicle_number", "").lower()
                or s in r.get("vehicle_make", "").lower()
                or s in r.get("vehicle_model", "").lower()
                or s in r.get("policy_id", "").lower()
            ]

        total = len(results)
        # Sort
        reverse = filters.sort_order == "desc"
        sort_key = filters.sort_by or "submission_date"
        results.sort(key=lambda x: str(x.get(sort_key, "")), reverse=reverse)

        # Paginate
        skip = (filters.page - 1) * filters.page_size
        items = results[skip:skip + filters.page_size]

        return items, total

    async def update_claim(self, claim_id: str, update_dict: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates specific fields of a claim."""
        update_dict.pop("_id", None)
        col = self.collection
        if col is not None:
            try:
                pattern = re.compile(f"^{re.escape(claim_id)}$", re.IGNORECASE)
                result = await col.find_one_and_update(
                    {"claim_id": pattern},
                    {"$set": update_dict},
                    projection={"_id": 0},
                    return_document=True
                )
                if result:
                    self._memory_store[claim_id.upper()] = dict(result)
                    return result
            except Exception as e:
                logger.warning(f"MongoDB update error: {e}")

        # In-memory fallback
        if claim_id.upper() in self._memory_store:
            self._memory_store[claim_id.upper()].update(update_dict)
            return self._memory_store[claim_id.upper()]
        return None

    async def update_claim_decision(
        self,
        claim_id: str,
        decision_data: Dict[str, Any],
        new_status: str
    ) -> Optional[Dict[str, Any]]:
        """Updates decision and status."""
        return await self.update_claim(claim_id, {
            "decision": decision_data,
            "status": new_status
        })

    async def delete_claim(self, claim_id: str) -> bool:
        """Deletes a claim."""
        col = self.collection
        if col is not None:
            try:
                pattern = re.compile(f"^{re.escape(claim_id)}$", re.IGNORECASE)
                await col.delete_one({"claim_id": pattern})
            except Exception:
                pass

        if claim_id.upper() in self._memory_store:
            del self._memory_store[claim_id.upper()]
            return True
        return False


claim_repository = ClaimRepository()
