import logging
from pymongo import ASCENDING, DESCENDING, TEXT
from app.core.database import db_manager

logger = logging.getLogger("claimshield.indexes")


async def init_indexes():
    """
    Ensures all critical MongoDB collection indexes are properly created.
    """
    db = db_manager.get_database()
    if db is None:
        logger.warning("Database client not available. Skipping index initialization.")
        return

    try:
        # Claims Collection Indexes
        claims_col = db["claims"]
        
        # Unique Claim ID index
        await claims_col.create_index([("claim_id", ASCENDING)], unique=True, name="idx_unique_claim_id")
        
        # Query filter indexes
        await claims_col.create_index([("risk_level", ASCENDING)], name="idx_risk_level")
        await claims_col.create_index([("status", ASCENDING)], name="idx_status")
        await claims_col.create_index([("submission_date", DESCENDING)], name="idx_submission_date_desc")
        await claims_col.create_index([("vehicle_number", ASCENDING)], name="idx_vehicle_number")
        await claims_col.create_index([("vehicle_make", ASCENDING)], name="idx_vehicle_make")

        # Full-text search index across core searchable fields
        await claims_col.create_index(
            [
                ("claim_id", TEXT),
                ("customer_name", TEXT),
                ("vehicle_number", TEXT),
                ("vehicle_make", TEXT),
                ("vehicle_model", TEXT),
                ("policy_id", TEXT)
            ],
            name="idx_claims_text_search"
        )
        logger.info("Claims collection indexes verified.")

        # Audit Logs Collection Indexes
        audit_col = db["audit_logs"]
        await audit_col.create_index([("claim_id", ASCENDING)], name="idx_audit_claim_id")
        await audit_col.create_index([("timestamp", DESCENDING)], name="idx_audit_timestamp_desc")
        await audit_col.create_index([("investigator_id", ASCENDING)], name="idx_audit_investigator_id")
        logger.info("Audit logs collection indexes verified.")

    except Exception as e:
        logger.error(f"Error creating MongoDB indexes: {e}")
