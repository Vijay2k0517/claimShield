from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Query
from app.models.similarity import SimilarClaimsListResponse, SimilarClaimItem
from app.services.similarity_service import similarity_service

router = APIRouter(tags=["Historical Similarity & Duplicate Detection"])


class ImageMatchQuery(BaseModel):
    image_url: str = Field(..., description="URL or upload path of vehicle damage photo to match")
    vehicle_make: Optional[str] = Field(None, description="Optional vehicle make filter")
    limit: Optional[int] = Field(default=5, ge=1, le=20)


@router.get(
    "/claims/{claim_id}/similar",
    response_model=SimilarClaimsListResponse,
    summary="Get Similar Historical Claims for a Claim ID"
)
async def get_similar_claims_for_claim(
    claim_id: str,
    limit: int = Query(default=5, ge=1, le=20, description="Max historical matches to return"),
    min_score: float = Query(default=50.0, ge=0.0, le=100.0, description="Minimum similarity threshold")
):
    """
    Retrieves visually and structurally similar claims for a given Claim ID to identify
    potential duplicate submissions, repeated staged accidents, or recurring impact damage.
    """
    return await similarity_service.find_similar_claims_by_id(
        claim_id=claim_id,
        limit=limit,
        min_score=min_score
    )
