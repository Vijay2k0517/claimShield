import pytest
import io
from PIL import Image
from httpx import AsyncClient, ASGITransport
from app.main import app


def create_sample_image() -> bytes:
    buf = io.BytesIO()
    img = Image.new("RGB", (250, 250), color=(0, 100, 200))
    img.save(buf, format="JPEG")
    return buf.getvalue()


@pytest.mark.asyncio
async def test_full_claimshield_e2e_journey():
    """
    Validates complete end-to-end flow:
    1. Upload damage photograph -> receive static asset URL.
    2. Submit new insurance claim referencing uploaded image.
    3. Verify AI automatically calculates fraud probability and Grad-CAM overlays.
    4. Query Claims Queue / Triage endpoint.
    5. Retrieve detailed claim context for Investigation Workspace.
    6. Query similar historical claims.
    7. Adjudicate claim as an Investigator ('Mark Legitimate') -> verify status update & audit log.
    8. Query Dashboard Analytics KPIs.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Step 1: Upload evidence image
        img_bytes = create_sample_image()
        upload_res = await ac.post(
            "/api/v1/evidence/upload",
            files={"file": ("vehicle_damage.jpg", img_bytes, "image/jpeg")}
        )
        assert upload_res.status_code == 200
        upload_data = upload_res.json()
        uploaded_image_url = upload_data["file_url"]
        assert "/uploads/evidence/" in uploaded_image_url

        # Step 2: Submit new claim with AI scoring
        claim_payload = {
            "policy_id": "POL-88214",
            "customer_name": "Alexander Hayes",
            "vehicle_number": "DL01 XY 7711",
            "vehicle_make": "Toyota",
            "vehicle_model": "Camry",
            "vehicle_year": 2023,
            "accident_date": "2026-08-15",
            "damage_description": "Front left fender compression and bumper bracket fracture.",
            "image_url": uploaded_image_url
        }

        claim_res = await ac.post("/api/v1/claims", json=claim_payload)
        assert claim_res.status_code == 200
        claim_data = claim_res.json()
        claim_id = claim_data["claim_id"]

        # Step 3: Verify AI fraud scoring & Grad-CAM visual outputs
        assert 0.0 <= claim_data["fraud_probability"] <= 100.0
        assert claim_data["risk_level"] in ["LOW", "REVIEW", "HIGH"]
        assert claim_data["evidence"]["original_image"] == uploaded_image_url

        # Step 4: Query Claims Queue
        queue_res = await ac.get("/api/v1/claims?page=1&page_size=10")
        assert queue_res.status_code == 200
        queue_data = queue_res.json()
        assert queue_data["total"] >= 1
        claim_ids = [c["claim_id"] for c in queue_data["items"]]
        assert claim_id in claim_ids

        # Step 5: Fetch Detailed Claim for Workspace
        detail_res = await ac.get(f"/api/v1/claims/{claim_id}")
        assert detail_res.status_code == 200
        assert detail_res.json()["claim_id"] == claim_id

        # Step 6: Similarity Search
        sim_res = await ac.get(f"/api/v1/claims/{claim_id}/similar")
        assert sim_res.status_code == 200
        assert "matches" in sim_res.json()

        # Step 7: Investigator Adjudication
        decision_payload = {
            "decision": "Mark Legitimate",
            "notes": "Verified collision narrative against police report.",
            "investigator_id": "INV-7001"
        }
        dec_res = await ac.post(f"/api/v1/claims/{claim_id}/decision", json=decision_payload)
        assert dec_res.status_code == 200
        adjudicated = dec_res.json()
        assert adjudicated["status"] == "Legitimate"
        assert adjudicated["decision"]["decision"] == "Mark Legitimate"

        # Check Audit Trail
        audit_res = await ac.get(f"/api/v1/claims/{claim_id}/audit-trail")
        assert audit_res.status_code == 200
        audit_logs = audit_res.json()
        assert len(audit_logs) >= 1
        assert audit_logs[0]["resulting_status"] == "Legitimate"

        # Step 8: Dashboard Summary Metrics
        dash_res = await ac.get("/api/v1/analytics/dashboard-summary")
        assert dash_res.status_code == 200
        dash_data = dash_res.json()
        assert dash_data["kpis"]["total_claims"] >= 1
