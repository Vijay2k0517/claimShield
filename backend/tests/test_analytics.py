import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_analytics_kpis_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/analytics/kpis")

    assert response.status_code == 200
    data = response.json()
    assert "total_claims" in data
    assert "pending_reviews" in data
    assert "high_risk_claims" in data
    assert "avg_fraud_probability" in data


@pytest.mark.asyncio
async def test_analytics_risk_distribution_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/analytics/risk-distribution")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    risk_names = [item["risk_level"] for item in data]
    assert "LOW" in risk_names
    assert "REVIEW" in risk_names
    assert "HIGH" in risk_names


@pytest.mark.asyncio
async def test_analytics_risk_trends_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/analytics/risk-trends?days=7")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 7
    assert "date" in data[0]
    assert "total" in data[0]


@pytest.mark.asyncio
async def test_analytics_dashboard_summary_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/analytics/dashboard-summary")

    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "risk_distribution" in data
    assert "risk_trends" in data
    assert "top_fraud_reasons" in data
    assert "model_alignment" in data
