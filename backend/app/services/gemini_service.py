from google import genai
from google.genai import types
from app.core.config import settings
import logging
import json
import base64

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = 'gemini-1.5-flash'
        
    async def generate_response(self, query: str, context: dict = None) -> dict:
        """
        Chat-specific generation with AgriSakhi persona.
        """
        system_instruction = """
        You are AgriSakhi, an expert agricultural assistant for farmers in Kerala.
        You output JSON strictly.
        Your response must answer the farmer's query (in Malayalam if context suggests or requested).
        Identify the intent. Provide actionable advice.
        """
        prompt = f"{system_instruction}\nContext: {context}\nQuery: {query}\nOutput JSON format: {{'response_text': '...', 'intent': '...', 'actions': [...]}}"
        return await self._call_gemini(prompt)

    async def generate_json(self, prompt: str) -> dict:
        """
        Generic generation for specific features (Crop Rec, Yield, etc).
        """
        return await self._call_gemini(prompt)

    async def analyze_image(self, prompt: str, image_base64: str) -> dict:
        """
        Analyzes an image + prompt.
        """
        try:
            if "base64," in image_base64:
                image_base64 = image_base64.split("base64,")[1]
            image_bytes = base64.b64decode(image_base64)
            
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=[
                    prompt,
                    types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Gemini Image Analysis Error: {e}")
            raise e

    async def _call_gemini(self, prompt: str) -> dict:
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            try:
                return json.loads(response.text)
            except json.JSONDecodeError:
                logger.error(f"Failed to parse JSON: {response.text}")
                return {"error": "Invalid JSON response", "raw": response.text}
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            raise e

gemini_service = GeminiService()
