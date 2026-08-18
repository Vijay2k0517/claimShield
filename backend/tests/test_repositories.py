import pytest
from app.core.database import db_manager
from app.repositories.claim_repo import claim_repository
from app.repositories.audit_repo import audit_repository
from app.models.claim import ClaimFilterParams
from app.models.enums import RiskLevel, ClaimStatus


@pytest.mark.asyncio
async def test_claim_repository_offline_safety():
    """Verify repository methods handle queries safely even if database is not active."""
    claim = await claim_repository.get_claim_by_id("CLM999")
    # If DB is not connected in test environment, it returns None safely
    assert claim is None

    items, total = await claim_repository.get_claims(ClaimFilterParams())
    assert isinstance(items, list)
    assert isinstance(total, int)


@pytest.mark.asyncio
async def test_audit_repository_offline_safety():
    audit_item = {
        "claim_id": "CLM001",
        "ai_risk_level": "HIGH",
        "ai_fraud_probability": 85.0,
        "investigator_decision": "Mark Legitimate",
        "resulting_status": "Legitimate",
        "investigator_id": "INV-001"
    }
    result = await audit_repository.create_audit_entry(audit_item)
    assert result["claim_id"] == "CLM001"

    logs = await audit_repository.get_audit_history()
    assert isinstance(logs, list)
