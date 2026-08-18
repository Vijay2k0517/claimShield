import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.similarity_service import similarity_service


def test_cosine_similarity_math():
    vec_a = [1.0, 0.0, 0.0]
    vec_b = [1.0, 0.0, 0.0]
    # Identical vectors should yield 1.0
    assert similarity_service.calculate_cosine_similarity(vec_a, vec_b) == 1.0

    vec_c = [0.0, 1.0, 0.0]
    # Orthogonal vectors should yield 0.0
    assert similarity_service.calculate_cosine_similarity(vec_a, vec_c) == 0.0

    # Empty vectors
    assert similarity_service.calculate_cosine_similarity([], []) == 0.0


@pytest.mark.asyncio
async def test_get_similar_claims_endpoint_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/claims/CLM999/similar")

    assert response.status_code == 200
    data = response.json()
    assert data["target_claim_id"] == "CLM999"
    assert data["total_matches"] == 0
    assert data["matches"] == []
