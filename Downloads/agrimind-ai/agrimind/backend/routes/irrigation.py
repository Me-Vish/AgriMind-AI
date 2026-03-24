from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional

from services.irrigation_service import IrrigationService
from services.translation_service import translate_text

router = APIRouter()
irrigation_service = IrrigationService()


class IrrigationPlanRequest(BaseModel):
    crop: str = Field(..., min_length=2, max_length=50)
    soil_type: str = Field(..., min_length=2, max_length=50)
    growth_stage: Literal["sowing", "vegetative", "flowering", "harvest"]
    farm_size: float = Field(..., gt=0, le=500)
    temperature: float = Field(..., ge=0, le=60)
    humidity: float = Field(..., ge=0, le=100)
    rainfall_7d: float = Field(..., ge=0, le=1000)
    language: Optional[str] = Field("en")


class IrrigationPlanResponse(BaseModel):
    irrigation_need: str
    next_irrigation: str
    water_amount: str
    risk_level: str
    recommendation_summary: str
    notes: list[str]


@router.post("/irrigation-plan", response_model=IrrigationPlanResponse)
async def create_irrigation_plan(request: IrrigationPlanRequest):
    try:
        result = await irrigation_service.plan(request.model_dump())

        if request.language and request.language != "en":
            for key in ("irrigation_need", "next_irrigation", "water_amount", "risk_level", "recommendation_summary"):
                result[key] = await translate_text(result[key], request.language)
            result["notes"] = [await translate_text(note, request.language) for note in result["notes"]]

        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Irrigation planning failed: {str(exc)}")
