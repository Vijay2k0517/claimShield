from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field, ConfigDict
from app.models.enums import DecisionType, RiskLevel, ClaimStatus


class DecisionCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    decision: DecisionType = Field(..., description="Adjudication outcome selected by investigator")
    notes: Optional[str] = Field(default="", description="Detailed rationale and justification notes")
    investigator_id: Optional[str] = Field(default="INV-CURRENT", description="ID of the investigator")


class DecisionResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    decision: str = Field(..., description="Decision text")
    notes: str = Field(default="", description="Investigator rationale notes")
    investigator_id: str = Field(default="INV-CURRENT", description="ID of the investigator")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO 8601 timestamp of adjudication"
    )


class AuditLogEntry(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    audit_id: Optional[str] = Field(None, description="Unique audit record identifier")
    claim_id: str = Field(..., description="Associated claim ID")
    ai_risk_level: RiskLevel = Field(..., description="Initial AI risk level assessed")
    ai_fraud_probability: float = Field(..., description="Initial AI fraud probability percentage")
    ai_model: Optional[str] = Field(None, description="AI model version used for assessment")
    investigator_decision: DecisionType = Field(..., description="Investigator final human decision")
    resulting_status: ClaimStatus = Field(..., description="New claim status after adjudication")
    investigator_id: str = Field(..., description="Investigator identifier")
    notes: Optional[str] = Field(default="", description="Investigator notes and justification")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="Timestamp of audit record"
    )
