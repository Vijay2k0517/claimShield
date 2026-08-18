from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class EvidenceBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    original_image: str = Field(..., description="URL or path to original damage evidence photograph")
    heatmap: Optional[str] = Field(None, description="URL to Grad-CAM / Attention heatmap visualization")
    overlay: Optional[str] = Field(None, description="URL to composite visual overlay highlighting damage focus")
    damage_description: Optional[str] = Field(None, description="Detailed description of physical damage")
    confidence_score: Optional[float] = Field(
        default=90.0,
        ge=0.0,
        le=100.0,
        description="Confidence score percentage of AI evidence extraction"
    )


class EvidencePayload(EvidenceBase):
    pass


class EvidenceUploadResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, from_attributes=True)

    filename: str
    file_url: str
    content_type: str
    size_bytes: int
    image_width: Optional[int] = None
    image_height: Optional[int] = None
