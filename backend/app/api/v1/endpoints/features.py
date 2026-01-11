
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.services.gemini_service import gemini_service
from firebase_admin import firestore
import httpx
import uuid

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
async def disease_detection(
    data: DiseaseDetectionRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Analyzes an uploaded crop image using Gemini Vision to detect diseases.
    Stores the result in Firestore.
    """
    # DUMMY DATA IMPLEMENTATION FOR TESTING
    import uuid
    scan_id = str(uuid.uuid4())
    
    # Simulate a delay if needed, or just return immediately
    
    dummy_result = {
          "diseaseName": "Bacterial Leaf Blight (Dummy)",
          "confidence": 92.5,
          "symptoms": "Water-soaked lesions, yellow halo, drying of leaf tips",
          "affectedCrops": "Rice, Wheat",
          "organicTreatments": "Spray Streptocycline, Use neem-based formulations, improve drainage"
    }

    # We return the dummy result without calling Gemini or Firestore
    return {
        "scanId": scan_id,
        "result": dummy_result
    }

    # ORIGINAL LOGIC COMMENTED OUT
    # try:
    #     # 1. Prepare Prompts
    #     system_instruction = "You are an expert plant pathologist AI. Your goal is to analyze crop images to detect diseases. Output MUST be valid JSON only."
    #     
    #     user_prompt = \"\"\"
    #     Analyze this image of a crop.
    #     1. Identify the crop name.
    #     2. Detect any specific disease or deficiency. If healthy, state "Healthy".
    #     3. Provide a confidence score (0-100).
    #     4. List 3 distinct visual symptoms you observed.
    #     5. Suggest 2 organic treatments.
    #     6. Suggest 1 chemical treatment (optional, only if necessary).
    # 
    #     Return ONLY JSON matching this schema:
    #     {
    #       "diseaseName": "string",
    #       "confidence": number,
    #       "symptoms": "string (list symptoms separated by commas)",
    #       "affectedCrops": "string (list crops separated by commas)",
    #       "organicTreatments": "string (list treatments separated by commas)"
    #     }
    #     \"\"\"
    # 
    #     # 2. Call Gemini Service (Optimized for URL if possible, or we download. 
    #     # Since our Gemini Service currently expects base64 or bytes, let's keep it simple.
    #     # However, passing URL to Gemini is cleaner if supported by the library version.
    #     # For likely compatibility with the existing `analyze_image` method in `gemini_service.py` which takes base64...
    #     # ACTUALLY, we should update `gemini_service.py` to handle URLs or just download here.
    #     # Let's download here to keep the service signature simple for now, or fetch bytes.
    #     
    #     # NOTE: To avoid heavy traffic on backend, we can check if Gemini supports URL directly.
    #     # But for stability, we will download the image from the URL we just generated.
    #     
    #     # Download image content
    #     async with httpx.AsyncClient() as client:
    #          img_resp = await client.get(data.image)
    #          if img_resp.status_code != 200:
    #              raise HTTPException(status_code=400, detail="Could not retrieve image for analysis.")
    #          image_bytes = img_resp.content
    #          mime_type = img_resp.headers.get("content-type", "image/jpeg")
    #          # Convert to base64 for the existing service method or use bytes directly
    #          import base64
    #          image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    # 
    #     # 3. Call AI
    #     ai_result = await gemini_service.analyze_image(
    #         prompt=f"{system_instruction}\n{user_prompt}",
    #         image_base64=image_base64,
    #         mime_type=mime_type
    #     )
    #     
    #     # 4. Store Result in Firestore
    #     scan_id = str(uuid.uuid4())
    #     db = firestore.client()
    #     
    #     scan_doc = {
    #         "id": scan_id,
    #         "userId": current_user['uid'],
    #         "imageUrl": data.image,
    #         "timestamp": firestore.SERVER_TIMESTAMP,
    #         "status": "analyzed",
    #         "result": ai_result
    #     }
    #     
    #     db.collection("scans").document(scan_id).set(scan_doc)
    # 
    #     return {
    #         "scanId": scan_id,
    #         "result": ai_result
    #     }
    # 
    # except Exception as e:
    #     print(f"Disease Detection Failed: {e}")
    #     raise HTTPException(status_code=500, detail="AI analysis failed. Please try again.")
