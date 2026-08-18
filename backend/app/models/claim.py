from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.models.enums import RiskLevel, ClaimStatus, RecommendationType
from app.models.evidence import EvidencePayload
from app.models.similarity import SimilarClaimItem
from app.models.decision import DecisionResponse


class ClaimBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    policy_id: str = Field(..., description="Insurance Policy ID (e.g. POL-98231)")
    customer_name: str = Field(..., description="Name of the claimant / policyholder")
    vehicle_number: str = Field(..., description="Registration or license plate number")
    vehicle_make: str = Field(..., description="Vehicle make (e.g. Hyundai, Tata, Maruti Suzuki)")
    vehicle_model: str = Field(..., description="Vehicle model (e.g. Creta, Nexon, Swift)")
    vehicle_year: int = Field(default_factory=lambda: datetime.now().year, description="Manufacturing year")
    accident_date: str = Field(..., description="Date of accident (YYYY-MM-DD)")


class ClaimCreate(ClaimBase):
    claim_id: Optional[str] = Field(None, description="Custom Claim ID (auto-generated if omitted)")
    damage_description: Optional[str] = Field(None, description="Description of damage from claimant")
    image_url: Optional[str] = Field(None, description="Direct URL or uploaded evidence reference")


class ClaimUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    status: Optional[ClaimStatus] = None
    notes: Optional[str] = None
    customer_name: Optional[str] = None
    damage_description: Optional[str] = None


class ClaimSummary(BaseModel):
    """Compact claim representation optimized for Claims Queue / Triage table."""
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    claim_id: str
    policy_id: str
    customer_name: str
    vehicle_number: str
    vehicle_make: str
    vehicle_model: str
    submission_date: str
    status: ClaimStatus
    fraud_probability: float
    risk_level: RiskLevel
    recommendation: Optional[str] = None
    flag_count: int = 0


class ClaimResponse(ClaimBase):
    """Full enterprise claim document matching frontend Investigation Workspace."""
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    claim_id: str = Field(..., description="Unique Claim ID (e.g. CLM001)")
    submission_date: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        description="Date claim was submitted"
    )
    status: ClaimStatus = Field(default=ClaimStatus.REVIEW, description="Investigation status")
    fraud_probability: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="AI estimated fraud probability percentage"
    )
    risk_level: RiskLevel = Field(..., description="Risk tier: LOW, REVIEW, HIGH")
    recommendation: str = Field(
        default="Manual Investigation",
        description="AI recommended next course of action"
    )
    ai_model: str = Field(
        default="DamageVision-ResNet50 v2.4",
        description="AI Model architecture identifier"
    )
    flag_reasons: List[str] = Field(
        default=[],
        description="List of AI detected anomaly signals and explainable reasons"
    )
    evidence: EvidencePayload = Field(
        ...,
        description="Visual damage evidence, heatmaps, and physical descriptions"
    )
    similar_claims: List[SimilarClaimItem] = Field(
        default=[],
        description="Historical similar claims surfaced by vector similarity search"
    )
    decision: Optional[DecisionResponse] = Field(
        default=None,
        description="Final human investigator adjudication outcome if reviewed"
    )


class ClaimListResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    items: List[ClaimResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ClaimFilterParams(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    risk_level: Optional[RiskLevel] = None
    status: Optional[ClaimStatus] = None
    vehicle_make: Optional[str] = None
    search: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    sort_by: Optional[str] = "submission_date"
    sort_order: Optional[str] = "desc"  # "asc" or "desc"
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=10, ge=1, le=100)
