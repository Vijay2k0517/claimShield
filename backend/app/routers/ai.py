from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException
from app.services.ai_service import ai_service
from app.models.enums import RiskLevel

router = APIRouter(prefix="/ai", tags=["AI & Explainability Engine"])


class ImageAnalysisRequest(BaseModel):
    image_url: str = Field(..., description="URL or upload path of vehicle damage photo")
    vehicle_make: Optional[str] = Field("", description="Vehicle manufacturer")
    vehicle_model: Optional[str] = Field("", description="Vehicle model")
    damage_description: Optional[str] = Field("", description="Description of damage from claimant")


class ImageAnalysisResponse(BaseModel):
    fraud_probability: float
    risk_level: RiskLevel
    recommendation: str
    confidence_score: float
    flag_reasons: List[str]
    ai_model: str
    heatmap_url: Optional[str]
    overlay_url: Optional[str]


class ModelInfoResponse(BaseModel):
    model_name: str
    version: str
    architecture: str
    input_resolution: str
    explainability_method: str
    target_classes: List[str]
    status: str


@router.post(
    "/analyze-image",
    response_model=ImageAnalysisResponse,
    summary="Direct AI Damage & Fraud Inspection"
)
async def analyze_image(payload: ImageAnalysisRequest):
    """
    Runs computer vision fraud risk classification on an image without creating a claim record.
    Returns fraud risk probability, risk level, anomaly flags, and Grad-CAM visual URLs.
    """
    result = await ai_service.analyze_claim(
        image_url_or_path=payload.image_url,
        vehicle_make=payload.vehicle_make or "",
        vehicle_model=payload.vehicle_model or "",
        damage_description=payload.damage_description or ""
    )
    return ImageAnalysisResponse(
        fraud_probability=result.fraud_probability,
        risk_level=result.risk_level,
        recommendation=result.recommendation,
        confidence_score=result.confidence_score,
        flag_reasons=result.flag_reasons,
        ai_model=result.ai_model,
        heatmap_url=result.heatmap_url,
        overlay_url=result.overlay_url
    )


@router.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Get AI Model Architecture & Diagnostic Information"
)
async def get_model_info():
    """
    Returns metadata about the active neural network model architecture and explainability layer.
    """
    return ModelInfoResponse(
        model_name="DamageVision-ResNet50",
        version="v2.4",
        architecture="Deep Residual Convolutional Neural Network (50 Layers) + Transfer Learning",
        input_resolution="224x224 RGB",
        explainability_method="Gradient-weighted Class Activation Mapping (Grad-CAM)",
        target_classes=["Legitimate Collision", "Pre-Existing Structural Wear", "Staged Impact", "Fabricated Damage"],
        status="active"
    )
