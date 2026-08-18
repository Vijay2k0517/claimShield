from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.evidence import EvidenceUploadResponse
from app.services.storage_service import storage_service

router = APIRouter(prefix="/evidence", tags=["Evidence & Media Management"])


@router.post(
    "/upload",
    response_model=EvidenceUploadResponse,
    summary="Upload Single Vehicle Evidence Image"
)
async def upload_evidence(
    file: UploadFile = File(..., description="Vehicle damage evidence photo (JPEG, PNG, WEBP)")
):
    """
    Upload a vehicle damage photograph. Validates image integrity, enforces size constraints,
    extracts metadata dimensions, and returns the static asset URL.
    """
    return await storage_service.save_upload_file(file, subfolder="evidence")


@router.post(
    "/upload-batch",
    response_model=List[EvidenceUploadResponse],
    summary="Batch Upload Multiple Evidence Images"
)
async def upload_evidence_batch(
    files: List[UploadFile] = File(..., description="Multiple vehicle damage photos")
):
    """
    Upload multiple damage photographs in a single batch request.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided in upload request.")

    results: List[EvidenceUploadResponse] = []
    for file in files:
        res = await storage_service.save_upload_file(file, subfolder="evidence")
        results.append(res)

    return results
