import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.ai_service import ai_service
from app.models.enums import RiskLevel


@pytest.mark.asyncio
async def test_ai_service_analyze_claim():
    result = await ai_service.analyze_claim(
        image_url_or_path="https://images.unsplash.com/photo-1590362891991-f776e747a588",
        vehicle_make="Hyundai",
        vehicle_model="Creta",
        damage_description="Staged collision with total loss characteristics and tool marks."
    )
    assert 0.0 <= result.fraud_probability <= 100.0
    assert result.risk_level in [RiskLevel.LOW, RiskLevel.REVIEW, RiskLevel.HIGH]
    assert len(result.embeddings) == 128
    assert result.ai_model == "DamageVision-ResNet50 v2.4"


@pytest.mark.asyncio
async def test_ai_analyze_image_endpoint():
    payload = {
        "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        "vehicle_make": "Maruti Suzuki",
        "vehicle_model": "Swift",
        "damage_description": "Right side door depression."
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/ai/analyze-image", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "fraud_probability" in data
    assert "risk_level" in data
    assert "flag_reasons" in data
    assert data["ai_model"] == "DamageVision-ResNet50 v2.4"


@pytest.mark.asyncio
async def test_ai_model_info_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/ai/model-info")

    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "DamageVision-ResNet50"
    assert data["version"] == "v2.4"
    assert "Grad-CAM" in data["explainability_method"]
    assert data["status"] == "active"
