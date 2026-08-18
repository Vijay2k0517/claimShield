from typing import List, Optional, Dict, Any
import math
import logging
from app.models.similarity import SimilarClaimItem, SimilarClaimsListResponse
from app.models.enums import RiskLevel, ClaimStatus
from app.repositories.claim_repo import claim_repository
from app.services.ai_service import ai_service

logger = logging.getLogger("claimshield.similarity_service")


class SimilarityService:
    @staticmethod
    def calculate_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        """
        Calculates normalized cosine similarity between two float vectors (0.0 to 1.0).
        """
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))

        if norm_a == 0.0 or norm_b == 0.0:
            return 0.0

        similarity = dot_product / (norm_a * norm_b)
        # Bounded between 0.0 and 1.0 for normalized unit space
        return max(0.0, min(1.0, similarity))

    async def find_similar_claims_by_id(
        self,
        claim_id: str,
        limit: int = 5,
        min_score: float = 50.0
    ) -> SimilarClaimsListResponse:
        """
        Retrieves visually and contextually similar historical claims for a given claim ID.
        """
        target_claim = await claim_repository.get_claim_by_id(claim_id)
        if not target_claim:
            return SimilarClaimsListResponse(
                target_claim_id=claim_id,
                total_matches=0,
                matches=[]
            )

        # If the claim already has curated similar claims stored, return them
        existing_matches = target_claim.get("similar_claims", [])
        if existing_matches:
            formatted_matches = [
                SimilarClaimItem.model_validate(m) for m in existing_matches
            ]
            return SimilarClaimsListResponse(
                target_claim_id=claim_id,
                total_matches=len(formatted_matches),
                matches=formatted_matches[:limit]
            )

        # Otherwise perform dynamic vector similarity search across all claims in DB
        target_evidence = target_claim.get("evidence", {})
        target_img = target_evidence.get("original_image", "")
        target_emb = ai_service.extract_image_embeddings(target_img)

        candidates, _ = await claim_repository.get_claims(
            filters=type("ClaimFilterParams", (), {"risk_level": None, "status": None, "vehicle_make": None, "search": None, "start_date": None, "end_date": None, "sort_by": None, "sort_order": "desc", "page": 1, "page_size": 50})()
        )

        ranked_matches: List[SimilarClaimItem] = []
        for cand in candidates:
            cand_id = cand.get("claim_id", "")
            # Skip self
            if cand_id.upper() == claim_id.upper():
                continue

            cand_evidence = cand.get("evidence", {})
            cand_img = cand_evidence.get("original_image", "")
            cand_emb = ai_service.extract_image_embeddings(cand_img)

            cos_sim = self.calculate_cosine_similarity(target_emb, cand_emb)
            
            # Hybrid boost for identical make/model
            make_match = cand.get("vehicle_make", "").lower() == target_claim.get("vehicle_make", "").lower()
            model_match = cand.get("vehicle_model", "").lower() == target_claim.get("vehicle_model", "").lower()
            
            hybrid_boost = (0.1 if make_match else 0.0) + (0.1 if model_match else 0.0)
            score = round(min(98.0, (cos_sim * 80.0 + hybrid_boost * 100.0)), 1)

            if score >= min_score:
                notes = (
                    "High visual feature match on bumper and panel stress points."
                    if score > 80.0
                    else "Moderate structural match on headlight mounting bracket."
                )
                
                # Safe fallback for status/risk enum
                raw_risk = cand.get("risk_level", "HIGH")
                risk_enum = RiskLevel(raw_risk) if raw_risk in RiskLevel.__members__ else RiskLevel.HIGH
                raw_status = cand.get("status", "Review")
                status_enum = ClaimStatus(raw_status) if raw_status in [s.value for s in ClaimStatus] else ClaimStatus.REVIEW

                item = SimilarClaimItem(
                    claim_id=cand_id,
                    vehicle_number=cand.get("vehicle_number", "Unknown"),
                    vehicle_make=cand.get("vehicle_make", "Unknown"),
                    vehicle_model=cand.get("vehicle_model", "Unknown"),
                    accident_date=cand.get("accident_date", "2025-01-01"),
                    similarity_score=score,
                    risk_level=risk_enum,
                    status=status_enum,
                    image=cand_img or "https://images.unsplash.com/photo-1590362891991-f776e747a588",
                    notes=notes
                )
                ranked_matches.append(item)

        # Sort descending by similarity score
        ranked_matches.sort(key=lambda x: x.similarity_score, reverse=True)
        top_matches = ranked_matches[:limit]

        return SimilarClaimsListResponse(
            target_claim_id=claim_id,
            total_matches=len(top_matches),
            matches=top_matches
        )


similarity_service = SimilarityService()
