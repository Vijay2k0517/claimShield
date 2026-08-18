from typing import List, Optional, Tuple, Dict, Any
from datetime import datetime, timezone
import logging
from fastapi import HTTPException

from app.models.claim import (
    ClaimCreate,
    ClaimResponse,
    ClaimListResponse,
    ClaimFilterParams,
)
from app.models.enums import ClaimStatus, DecisionType, RiskLevel
from app.models.decision import DecisionCreate, DecisionResponse, AuditLogEntry
from app.models.evidence import EvidencePayload
from app.repositories.claim_repo import claim_repository
from app.repositories.audit_repo import audit_repository
from app.services.ai_service import ai_service
from app.services.similarity_service import similarity_service

logger = logging.getLogger("claimshield.claim_service")

# Map human investigator decision to new claim status
DECISION_STATUS_MAP = {
    DecisionType.MARK_LEGITIMATE: ClaimStatus.LEGITIMATE,
    DecisionType.REQUEST_ADDITIONAL_EVIDENCE: ClaimStatus.PENDING,
    DecisionType.ESCALATE_INVESTIGATION: ClaimStatus.ESCALATED,
}


class ClaimService:
    async def submit_new_claim(self, claim_data: ClaimCreate) -> ClaimResponse:
        """
        Processes claim intake:
        1. Auto-generates sequential Claim ID if omitted.
        2. Executes AI fraud risk classification & Grad-CAM visual generation.
        3. Retrieves visually/contextually similar historical claims.
        4. Persists the complete claim document to MongoDB.
        """
        claim_id = claim_data.claim_id
        if not claim_id:
            claim_id = await claim_repository.get_next_claim_id()

        image_ref = (
            claim_data.image_url
            or "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"
        )
        damage_desc = claim_data.damage_description or "Vehicle collision damage submitted for SIU review."

        # 1. Run AI Inference Engine
        ai_result = await ai_service.analyze_claim(
            image_url_or_path=image_ref,
            vehicle_make=claim_data.vehicle_make,
            vehicle_model=claim_data.vehicle_model,
            damage_description=damage_desc
        )

        evidence_payload = EvidencePayload(
            original_image=image_ref,
            heatmap=ai_result.heatmap_url or image_ref,
            overlay=ai_result.overlay_url or image_ref,
            damage_description=damage_desc,
            confidence_score=ai_result.confidence_score
        )

        # 2. Dynamic Similarity Search
        sim_response = await similarity_service.find_similar_claims_by_id(claim_id=claim_id, limit=3)
        similar_items = sim_response.matches

        submission_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        # 3. Construct Complete Claim Document
        full_claim_dict: Dict[str, Any] = {
            "claim_id": claim_id,
            "policy_id": claim_data.policy_id,
            "customer_name": claim_data.customer_name,
            "vehicle_number": claim_data.vehicle_number,
            "vehicle_make": claim_data.vehicle_make,
            "vehicle_model": claim_data.vehicle_model,
            "vehicle_year": claim_data.vehicle_year,
            "accident_date": claim_data.accident_date,
            "submission_date": submission_date,
            "status": ClaimStatus.REVIEW.value,
            "fraud_probability": ai_result.fraud_probability,
            "risk_level": ai_result.risk_level.value,
            "recommendation": ai_result.recommendation,
            "ai_model": ai_result.ai_model,
            "flag_reasons": ai_result.flag_reasons,
            "evidence": evidence_payload.model_dump(),
            "similar_claims": [item.model_dump() for item in similar_items],
            "decision": None
        }

        # 4. Save to Database
        try:
            await claim_repository.create_claim(full_claim_dict)
        except Exception as e:
            logger.warning(f"Could not persist claim to MongoDB ({e}). Returning in-memory claim object.")

        return ClaimResponse.model_validate(full_claim_dict)

    async def get_claim_details(self, claim_id: str) -> ClaimResponse:
        """Retrieves a single claim by its unique ID."""
        doc = await claim_repository.get_claim_by_id(claim_id)
        if not doc:
            raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")
        return ClaimResponse.model_validate(doc)

    async def query_claims(self, filters: ClaimFilterParams) -> ClaimListResponse:
        """Retrieves a paginated list of claims matching query filters."""
        items_raw, total = await claim_repository.get_claims(filters)
        items = [ClaimResponse.model_validate(d) for d in items_raw]
        
        total_pages = (total + filters.page_size - 1) // filters.page_size if filters.page_size > 0 else 1

        return ClaimListResponse(
            items=items,
            total=total,
            page=filters.page,
            page_size=filters.page_size,
            total_pages=total_pages
        )

    async def adjudicate_claim(
        self,
        claim_id: str,
        decision_in: DecisionCreate
    ) -> ClaimResponse:
        """
        Records human investigator decision:
        1. Validates claim existence.
        2. Applies status transition.
        3. Updates claim document.
        4. Writes an immutable audit entry into `audit_logs`.
        """
        claim_doc = await claim_repository.get_claim_by_id(claim_id)
        if not claim_doc:
            raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")

        # Determine new status based on investigator decision
        new_status = DECISION_STATUS_MAP.get(decision_in.decision, ClaimStatus.REVIEW)

        decision_timestamp = datetime.now(timezone.utc).isoformat()
        decision_record = DecisionResponse(
            decision=decision_in.decision.value,
            notes=decision_in.notes or "",
            investigator_id=decision_in.investigator_id or "INV-CURRENT",
            timestamp=decision_timestamp
        )

        # Update in database
        updated_doc = await claim_repository.update_claim_decision(
            claim_id=claim_id,
            decision_data=decision_record.model_dump(),
            new_status=new_status.value
        )

        # Fallback if DB was offline
        if not updated_doc:
            claim_doc["decision"] = decision_record.model_dump()
            claim_doc["status"] = new_status.value
            updated_doc = claim_doc

        # Write audit log entry
        raw_risk = claim_doc.get("risk_level", "HIGH")
        risk_enum = RiskLevel(raw_risk) if raw_risk in RiskLevel.__members__ else RiskLevel.HIGH

        audit_entry = AuditLogEntry(
            claim_id=claim_id,
            ai_risk_level=risk_enum,
            ai_fraud_probability=claim_doc.get("fraud_probability", 80.0),
            ai_model=claim_doc.get("ai_model", "DamageVision-ResNet50 v2.4"),
            investigator_decision=decision_in.decision,
            resulting_status=new_status,
            investigator_id=decision_in.investigator_id or "INV-CURRENT",
            notes=decision_in.notes or "",
            timestamp=decision_timestamp
        )

        try:
            await audit_repository.create_audit_entry(audit_entry.model_dump())
        except Exception as e:
            logger.warning(f"Could not record audit log: {e}")

        return ClaimResponse.model_validate(updated_doc)

    async def get_audit_history_for_claim(self, claim_id: str) -> List[AuditLogEntry]:
        """Fetches audit trail logs for a claim."""
        raw_logs = await audit_repository.get_audit_history(claim_id=claim_id)
        return [AuditLogEntry.model_validate(l) for l in raw_logs]


claim_service = ClaimService()
