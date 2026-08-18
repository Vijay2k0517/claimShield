from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.enums import RiskLevel, ClaimStatus


class SimilarClaimItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    claim_id: str = Field(..., description="Historical Claim ID reference")
    vehicle_number: str = Field(..., description="Registration / License plate of historical vehicle")
    vehicle_make: str = Field(..., description="Vehicle make (e.g. Hyundai, Toyota)")
    vehicle_model: str = Field(..., description="Vehicle model (e.g. Creta, Swift)")
    accident_date: str = Field(..., description="Date of historical accident (YYYY-MM-DD)")
    similarity_score: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Visual / metadata similarity score percentage (0-100)"
    )
    risk_level: RiskLevel = Field(..., description="Risk level classification of historical claim")
    status: ClaimStatus = Field(..., description="Status of historical claim")
    image: str = Field(..., description="URL to historical vehicle damage photo")
    notes: Optional[str] = Field(None, description="Investigation remarks on why claims match")


class SimilarClaimsListResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    target_claim_id: str
    total_matches: int
    matches: List[SimilarClaimItem] = []
