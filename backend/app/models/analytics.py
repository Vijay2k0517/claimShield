from typing import List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class KPISummary(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    total_claims: int = Field(0, description="Total number of submitted claims")
    pending_reviews: int = Field(0, description="Claims currently pending investigator review")
    high_risk_claims: int = Field(0, description="Claims flagged as HIGH risk by AI")
    escalated_claims: int = Field(0, description="Claims escalated to SIU / Special Investigations")
    legitimate_claims: int = Field(0, description="Claims approved as legitimate by human investigator")
    avg_fraud_probability: float = Field(0.0, description="Average fraud probability percentage")


class RiskDistributionItem(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    risk_level: str
    count: int
    percentage: float


class RiskTrendPoint(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    date: str
    low: int = 0
    review: int = 0
    high: int = 0
    total: int = 0


class FraudReasonFrequency(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    reason: str
    count: int
    percentage: float


class ModelAlignmentMetrics(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    total_adjudicated: int = 0
    ai_human_agreed: int = 0
    ai_human_disagreed: int = 0
    agreement_rate: float = 0.0
    false_positives_mitigated: int = 0
