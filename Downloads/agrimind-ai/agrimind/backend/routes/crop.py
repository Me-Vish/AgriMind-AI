"""
AgriMind AI - Crop Prediction Routes
Random Forest based crop recommendation system
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.crop_service import CropPredictionService
from services.translation_service import translate_response

router = APIRouter()
crop_service = CropPredictionService()


class CropPredictionRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content (kg/ha)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content (kg/ha)")
    potassium: float = Field(..., ge=0, le=300, description="Potassium content (kg/ha)")
    temperature: float = Field(..., ge=0, le=60, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Relative Humidity (%)")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    rainfall: float = Field(..., ge=0, le=5000, description="Annual Rainfall (mm)")
    soil_type: Optional[str] = Field(None, description="Soil type")
    season: Optional[str] = Field(None, description="Cropping season")
    language: Optional[str] = Field("en", description="Response language: en, ta, hi")


class CropResult(BaseModel):
    crop: str
    probability: float
    suitability_score: int
    reason: str


class CropPredictionResponse(BaseModel):
    top_crops: list[CropResult]
    explanation: str
    soil_analysis: dict
    recommendation_summary: str


@router.post("/predict-crop", response_model=CropPredictionResponse)
async def predict_crop(request: CropPredictionRequest):
    """
    Predict top crop recommendations based on soil and climate parameters.
    Uses a trained Random Forest classifier with confidence scores.
    """
    try:
        result = await crop_service.predict(request)

        if request.language and request.language != "en":
            result = await translate_response(result, request.language)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
