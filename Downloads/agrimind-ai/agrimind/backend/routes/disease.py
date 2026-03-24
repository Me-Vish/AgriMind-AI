"""
AgriMind AI - Disease Detection Routes
CNN/MobileNet based plant disease identification
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import os
import uuid
import aiofiles
from services.disease_service import DiseaseDetectionService

router = APIRouter()
disease_service = DiseaseDetectionService()

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/detect-disease")
async def detect_disease(
    file: UploadFile = File(...),
    language: Optional[str] = Form("en")
):
    """
    Detect plant disease from uploaded leaf image.
    Returns disease name, confidence score, and treatment recommendations.
    """
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read and validate file size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")

    # Save to uploads directory
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    try:
        result = await disease_service.analyze(filepath, language)
        result["image_url"] = f"/uploads/{filename}"
        return result
    except Exception as e:
        # Clean up file on error
        if os.path.exists(filepath):
            os.remove(filepath)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
