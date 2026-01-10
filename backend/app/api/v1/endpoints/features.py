
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class CropRecRequest(BaseModel):
    soilAnalysis: Optional[str] = None
    weatherData: Optional[str] = None
    location: Optional[str] = None

@router.post("/crop-recommendation")
async def crop_recommendation(data: CropRecRequest):
    return {
        "result": {
            "recommendedCrops": ["Rice", "Sugar Cane"],
            "reasoning": "Based on the high Nitrogen levels and plenty of water availability in Mangalagiri."
        }
    }

class YieldPredRequest(BaseModel):
    cropType: Optional[str] = None
    farmSize: Optional[float] = None
    soilType: Optional[str] = None
    fertilizerUsed: Optional[str] = None
    historicalYieldData: Optional[str] = None
    currentWeatherData: Optional[str] = None

@router.post("/yield-prediction")
async def yield_prediction(data: YieldPredRequest):
    return {
        "result": {
            "estimatedYield": 4.5,
            "confidenceInterval": "4.2 - 4.8",
            "factorsInfluencingYield": "Good rain",
            "recommendations": "Harvest soon"
        }
    }

class DiseaseDetectionRequest(BaseModel):
    image: str # Base64 string

@router.post("/disease-detection")
async def disease_detection(data: DiseaseDetectionRequest):
    return {
        "result": {
            "diseaseName": "Leaf Spot",
            "confidence": 85.0,
            "symptoms": "Yellowing of leaves, brown spots.",
            "affectedCrops": "Wheat, Corn",
            "organicTreatments": "Neem oil spray."
        }
    }
