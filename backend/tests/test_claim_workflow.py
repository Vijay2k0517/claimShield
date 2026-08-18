import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_submit_new_claim_workflow():
    payload = {
        "policy_id": "POL-99112",
        "customer_name": "Marcus Vance",
        "vehicle_number": "KA01 MH 8899",
        "vehicle_make": "Toyota",
        "vehicle_model": "Innova Hycross",
        "vehicle_year": 2024,
        "accident_date": "2026-08-16",
        "damage_description": "Rear bumper collision damage and cracked diffuser.",
        "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/claims", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["policy_id"] == "POL-99112"
    assert data["customer_name"] == "Marcus Vance"
    assert data["claim_id"].startswith("CLM")
    assert "fraud_probability" in data
    assert data["risk_level"] in ["LOW", "REVIEW", "HIGH"]
    assert "evidence" in data
    assert data["evidence"]["original_image"] == payload["image_url"]


@pytest.mark.asyncio
async def test_list_claims_queue_with_filter():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/claims?page=1&page_size=5")

    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["page"] == 1
    assert data["page_size"] == 5


@pytest.mark.asyncio
async def test_adjudicate_claim_workflow():
    # 1. Create a claim to adjudicate
    payload = {
        "policy_id": "POL-77119",
        "customer_name": "Elena Rostova",
        "vehicle_number": "MH02 BX 4455",
        "vehicle_make": "Honda",
        "vehicle_model": "Elevate",
        "vehicle_year": 2023,
        "accident_date": "2026-08-14",
        "damage_description": "Side door scratch verified with dashcam video."
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        create_res = await ac.post("/api/v1/claims", json=payload)
        created_claim = create_res.json()
        claim_id = created_claim["claim_id"]

        # 2. Adjudicate as 'Mark Legitimate'
        decision_payload = {
            "decision": "Mark Legitimate",
            "notes": "Dashcam video confirmed third party liability. Claim approved.",
            "investigator_id": "INV-9901"
        }
        dec_res = await ac.post(f"/api/v1/claims/{claim_id}/decision", json=decision_payload)
        assert dec_res.status_code == 200
        updated = dec_res.json()
        assert updated["status"] == "Legitimate"
        assert updated["decision"]["decision"] == "Mark Legitimate"
        assert updated["decision"]["investigator_id"] == "INV-9901"

        # 3. Retrieve audit trail
        audit_res = await ac.get(f"/api/v1/claims/{claim_id}/audit-trail")
        assert audit_res.status_code == 200
        audit_logs = audit_res.json()
        assert len(audit_logs) >= 1
        assert audit_logs[0]["resulting_status"] == "Legitimate"
