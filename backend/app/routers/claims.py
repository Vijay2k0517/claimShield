from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from app.models.claim import (
    ClaimCreate,
    ClaimResponse,
    ClaimListResponse,
    ClaimFilterParams,
)
from app.models.enums import RiskLevel, ClaimStatus
from app.models.decision import DecisionCreate, AuditLogEntry
from app.services.claim_service import claim_service

router = APIRouter(prefix="/claims", tags=["Claims & Investigation Workflow"])


@router.post(
    "",
    response_model=ClaimResponse,
    summary="Submit New Claim (Intake & Automated AI Scoring)"
)
async def submit_claim(claim_in: ClaimCreate):
    """
    Submits a vehicle insurance claim. Automatically evaluates visual damage evidence,
    calculates fraud risk score, generates Grad-CAM overlays, identifies similar historical claims,
    and queues for investigator review.
    """
    return await claim_service.submit_new_claim(claim_in)


@router.get(
    "",
    response_model=ClaimListResponse,
    summary="List Claims with Triage Filters, Search & Pagination"
)
async def get_claims(
    risk_level: Optional[RiskLevel] = Query(None, description="Filter by risk tier: LOW, REVIEW, HIGH"),
    status: Optional[ClaimStatus] = Query(None, description="Filter by status: Review, Pending, Escalated, Legitimate"),
    vehicle_make: Optional[str] = Query(None, description="Filter by vehicle make (e.g. Hyundai, Toyota)"),
    search: Optional[str] = Query(None, description="Search across Claim ID, Customer Name, VIN, Plate, Policy"),
    start_date: Optional[str] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date filter (YYYY-MM-DD)"),
    sort_by: Optional[str] = Query("submission_date", description="Field to sort by"),
    sort_order: Optional[str] = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page")
):
    """
    Retrieves a paginated list of claims with comprehensive filtering for the Claims Queue / Triage view.
    """
    filters = ClaimFilterParams(
        risk_level=risk_level,
        status=status,
        vehicle_make=vehicle_make,
        search=search,
        start_date=start_date,
        end_date=end_date,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size
    )
    return await claim_service.query_claims(filters)


@router.get(
    "/{claim_id}",
    response_model=ClaimResponse,
    summary="Get Detailed Claim Context for Investigation Workspace"
)
async def get_claim(claim_id: str):
    """
    Retrieves full details for a single claim, including vehicle specifications, AI fraud probability,
    explainable AI heatmaps, similar historical claims, and current adjudication decision.
    """
    return await claim_service.get_claim_details(claim_id)


@router.post(
    "/{claim_id}/decision",
    response_model=ClaimResponse,
    summary="Record Investigator Adjudication Decision"
)
async def record_decision(claim_id: str, decision_in: DecisionCreate):
    """
    Records human investigator decision ('Mark Legitimate', 'Request Additional Evidence', 'Escalate Investigation')
    with reasoning notes, updates claim status, and records an immutable audit log entry.
    """
    return await claim_service.adjudicate_claim(claim_id, decision_in)


@router.get(
    "/{claim_id}/audit-trail",
    response_model=List[AuditLogEntry],
    summary="Get Claim Investigation Audit History"
)
async def get_audit_trail(claim_id: str):
    """
    Retrieves the chronological audit log entries recorded during the investigation of a claim.
    """
    return await claim_service.get_audit_history_for_claim(claim_id)


@router.delete(
    "/{claim_id}",
    summary="Delete a Specific Claim"
)
async def delete_claim(claim_id: str):
    """
    Permanently deletes a claim record from the database.
    """
    deleted = await claim_service.delete_claim(claim_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found.")
    return {"message": f"Claim '{claim_id}' has been permanently deleted.", "claim_id": claim_id}


@router.delete(
    "",
    summary="Delete All Claims (Clear Database)"
)
async def delete_all_claims():
    """
    Permanently deletes all claims from the database to start with a clean state.
    """
    count = await claim_service.delete_all_claims()
    return {"message": f"Successfully removed {count} claims.", "deleted_count": count}
