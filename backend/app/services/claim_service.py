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

        # 2. Dynamic Similarity Search against existing claims repository
        target_emb = ai_service.extract_image_embeddings(image_ref)
        candidates, _ = await claim_repository.get_claims(
            filters=type("ClaimFilterParams", (), {"risk_level": None, "status": None, "vehicle_make": None, "search": None, "start_date": None, "end_date": None, "sort_by": None, "sort_order": "desc", "page": 1, "page_size": 100})()
        )

        similar_items = []
        highest_match = 0.0
        top_matching_claim_id = ""

        for cand in candidates:
            cand_id = cand.get("claim_id", "")
            cand_img = cand.get("evidence", {}).get("original_image", "")
            cand_emb = ai_service.extract_image_embeddings(cand_img)
            cos_sim = similarity_service.calculate_cosine_similarity(target_emb, cand_emb)
            score = round(cos_sim * 100.0, 1)

            if score >= 50.0:
                if score > highest_match:
                    highest_match = score
                    top_matching_claim_id = cand_id

                notes = (
                    "CRITICAL: Duplicate / recycled accident photograph detected (Syndicate Fraud Alert)."
                    if score >= 95.0
                    else "High visual feature match on bumper and structural deformation points."
                    if score >= 80.0
                    else "Moderate structural feature alignment on vehicle panel angles."
                )

                raw_risk = cand.get("risk_level", "HIGH")
                risk_enum = RiskLevel(raw_risk) if raw_risk in RiskLevel.__members__ else RiskLevel.HIGH
                raw_status = cand.get("status", "Review")
                status_enum = ClaimStatus(raw_status) if raw_status in [s.value for s in ClaimStatus] else ClaimStatus.REVIEW

                similar_items.append({
                    "claim_id": cand_id,
                    "vehicle_number": cand.get("vehicle_number", "Unknown"),
                    "vehicle_make": cand.get("vehicle_make", "Unknown"),
                    "vehicle_model": cand.get("vehicle_model", "Unknown"),
                    "accident_date": cand.get("accident_date", "2025-01-01"),
                    "similarity_score": score,
                    "risk_level": risk_enum.value,
                    "status": status_enum.value,
                    "image": cand_img or image_ref,
                    "notes": notes
                })

        similar_items.sort(key=lambda x: x["similarity_score"], reverse=True)

        # 3. Fraud Risk Elevation if duplicate image is detected
        final_fraud_prob = ai_result.fraud_probability
        final_risk_level = ai_result.risk_level.value
        final_recommendation = ai_result.recommendation
        final_flag_reasons = list(ai_result.flag_reasons)

        if highest_match >= 90.0:
            final_fraud_prob = 98.5
            final_risk_level = RiskLevel.HIGH.value
            final_recommendation = "Manual Investigation (SIU Referral)"
            final_flag_reasons.insert(0, f"CRITICAL: {highest_match}% duplicate visual match detected against prior historical claim {top_matching_claim_id} (Recycled photo fraud).")
        elif highest_match >= 75.0:
            final_fraud_prob = max(final_fraud_prob, 76.0)
            final_risk_level = RiskLevel.HIGH.value
            final_flag_reasons.insert(0, f"High visual similarity ({highest_match}%) with prior collision damage record {top_matching_claim_id}.")

        evidence_payload = EvidencePayload(
            original_image=image_ref,
            heatmap=ai_result.heatmap_url or image_ref,
            overlay=ai_result.overlay_url or image_ref,
            damage_description=damage_desc,
            confidence_score=ai_result.confidence_score
        )

        submission_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

        # 4. Construct Complete Claim Document
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
            "fraud_probability": final_fraud_prob,
            "risk_level": final_risk_level,
            "recommendation": final_recommendation,
            "ai_model": ai_result.ai_model,
            "flag_reasons": final_flag_reasons,
            "evidence": evidence_payload.model_dump(),
            "similar_claims": similar_items[:3],
            "decision": None
        }

        # 5. Save to Database
        try:
            await claim_repository.create_claim(full_claim_dict)
        except Exception as e:
            logger.warning(f"Could not persist claim to MongoDB ({e}). Returning in-memory claim object.")

        return ClaimResponse.model_validate(full_claim_dict)

    async def get_claim_details(self, claim_id: str) -> ClaimResponse:
        """Retrieves a single claim by its unique ID, dynamically attaching live similar claims."""
        doc = await claim_repository.get_claim_by_id(claim_id)
        if not doc:
            raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")

        # Dynamically attach similar claims if missing or outdated
        sim_res = await similarity_service.find_similar_claims_by_id(claim_id=claim_id, limit=3)
        if sim_res.matches:
            doc["similar_claims"] = [m.model_dump() for m in sim_res.matches]

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

    async def delete_claim(self, claim_id: str) -> bool:
        """Deletes a specific claim."""
        return await claim_repository.delete_claim(claim_id)

    async def delete_all_claims(self) -> int:
        """Deletes all claims from the database."""
        return await claim_repository.delete_all_claims()


claim_service = ClaimService()
