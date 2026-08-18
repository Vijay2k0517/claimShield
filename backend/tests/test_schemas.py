import pytest
from pydantic import ValidationError
from app.models import (
    RiskLevel,
    ClaimStatus,
    DecisionType,
    EvidencePayload,
    SimilarClaimItem,
    DecisionResponse,
    DecisionCreate,
    ClaimCreate,
    ClaimResponse,
    ClaimSummary,
    KPISummary,
    AuditLogEntry
)


def test_claim_create_valid():
    claim_in = ClaimCreate(
        policy_id="POL-12345",
        customer_name="John Doe",
        vehicle_number="TN01 AB 1234",
        vehicle_make="Toyota",
        vehicle_model="Fortuner",
        vehicle_year=2023,
        accident_date="2026-08-10",
        damage_description="Rear fender dent and tail light breakage."
    )
    assert claim_in.policy_id == "POL-12345"
    assert claim_in.vehicle_make == "Toyota"
    assert claim_in.vehicle_year == 2023


def test_claim_response_serialization():
    claim_dict = {
        "claim_id": "CLM001",
        "policy_id": "POL-98231",
        "customer_name": "Sarah Jenkins",
        "vehicle_number": "TN01 AB 1234",
        "vehicle_make": "Hyundai",
        "vehicle_model": "Creta",
        "vehicle_year": 2023,
        "accident_date": "2026-08-15",
        "submission_date": "2026-08-17",
        "status": "Review",
        "fraud_probability": 87.0,
        "risk_level": "HIGH",
        "recommendation": "Manual Investigation",
        "ai_model": "DamageVision-ResNet50 v2.4",
        "flag_reasons": [
            "Damage inconsistency detected."
        ],
        "evidence": {
            "original_image": "https://example.com/img.jpg",
            "heatmap": "https://example.com/heat.jpg",
            "overlay": "https://example.com/over.jpg",
            "damage_description": "Front bumper compression.",
            "confidence_score": 94.2
        },
        "similar_claims": [
            {
                "claim_id": "CLM045",
                "vehicle_number": "TN09 XY 4567",
                "vehicle_make": "Hyundai",
                "vehicle_model": "Creta",
                "accident_date": "2025-11-12",
                "similarity_score": 91.0,
                "risk_level": "HIGH",
                "status": "Escalated",
                "image": "https://example.com/old.jpg",
                "notes": "Identical impact angle."
            }
        ],
        "decision": None
    }
    
    claim = ClaimResponse.model_validate(claim_dict)
    assert claim.claim_id == "CLM001"
    assert claim.risk_level == RiskLevel.HIGH
    assert claim.evidence.confidence_score == 94.2
    assert len(claim.similar_claims) == 1
    assert claim.similar_claims[0].similarity_score == 91.0


def test_decision_create_validation():
    decision_in = DecisionCreate(
        decision=DecisionType.MARK_LEGITIMATE,
        notes="All damage verified by repair shop receipts.",
        investigator_id="INV-9021"
    )
    assert decision_in.decision == DecisionType.MARK_LEGITIMATE
    assert decision_in.investigator_id == "INV-9021"


def test_invalid_probability_validation():
    with pytest.raises(ValidationError):
        EvidencePayload(
            original_image="https://example.com/img.jpg",
            confidence_score=150.0  # Invalid: > 100
        )


def test_audit_log_entry_defaults():
    audit = AuditLogEntry(
        claim_id="CLM001",
        ai_risk_level=RiskLevel.HIGH,
        ai_fraud_probability=85.0,
        investigator_decision=DecisionType.MARK_LEGITIMATE,
        resulting_status=ClaimStatus.LEGITIMATE,
        investigator_id="INV-001"
    )
    assert audit.claim_id == "CLM001"
    assert audit.ai_risk_level == RiskLevel.HIGH
    assert audit.resulting_status == ClaimStatus.LEGITIMATE
    assert audit.timestamp is not None
