import os
import uuid
import logging
from pathlib import Path
from typing import Tuple, List, Optional
from fastapi import UploadFile, HTTPException
from PIL import Image
import io

from app.core.config import settings
from app.models.evidence import EvidenceUploadResponse

logger = logging.getLogger("claimshield.storage")

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


class StorageService:
    def __init__(self):
        self.upload_base_dir = settings.UPLOAD_PATH

    def get_target_dir(self, subfolder: str = "evidence") -> Path:
        target = self.upload_base_dir / subfolder
        target.mkdir(parents=True, exist_ok=True)
        return target

    async def save_upload_file(
        self,
        file: UploadFile,
        subfolder: str = "evidence"
    ) -> EvidenceUploadResponse:
        """
        Validates, sanitizes, and persists an uploaded damage evidence image to disk.
        """
        if not file.filename:
            raise HTTPException(status_code=400, detail="Missing filename in upload payload.")

        # 1. Validate file extension
        ext = os.path.splitext(file.filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file extension '{ext}'. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
            )

        # 2. Read contents into memory for inspection
        contents = await file.read()
        size_bytes = len(contents)

        # Check maximum allowed size
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if size_bytes > max_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File exceeds maximum upload size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        if size_bytes == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # 3. Inspect binary validity and dimensions using Pillow
        width, height, mime_type = self._inspect_image_binary(contents, file.content_type)

        # 4. Generate collision-free unique filename
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        target_dir = self.get_target_dir(subfolder)
        target_path = target_dir / unique_filename

        # 5. Write to destination
        with open(target_path, "wb") as f:
            f.write(contents)

        logger.info(f"Successfully saved image {unique_filename} ({width}x{height}, {size_bytes} bytes)")

        # Form public static URL
        public_url = f"/uploads/{subfolder}/{unique_filename}"

        return EvidenceUploadResponse(
            filename=unique_filename,
            file_url=public_url,
            content_type=mime_type,
            size_bytes=size_bytes,
            image_width=width,
            image_height=height
        )

    def _inspect_image_binary(self, data: bytes, declared_mime: Optional[str]) -> Tuple[int, int, str]:
        """
        Ensures the byte stream is a valid image and extracts dimensions.
        """
        try:
            with Image.open(io.BytesIO(data)) as img:
                img.verify()

            # Reopen to read dimensions since verify() closes/resets the image
            with Image.open(io.BytesIO(data)) as img:
                width, height = img.size
                detected_format = (img.format or "JPEG").lower()
                detected_mime = f"image/{'jpeg' if detected_format == 'jpg' else detected_format}"
                return width, height, detected_mime
        except Exception as e:
            logger.warning(f"Corrupt or non-image binary stream received: {e}")
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is not a valid image or is corrupted."
            )


storage_service = StorageService()
