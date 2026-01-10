from google import genai
from google.genai import types
from app.core.config import settings
import logging
import json

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        # Initialize the client from the new SDK
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model_id = 'gemini-1.5-flash'
        
    async def generate_response(self, query: str, context: dict = None) -> dict:
        """
        Generates a structured response from Gemini based on query and context.
        """
        system_instruction = """
        You are AgriSakhi, an expert agricultural assistant for farmers in Kerala.
        You output JSON strictly.
        Your response must answer the farmer's query in Malayalam (unless English is requested).
        Identify the intent (e.g., crop_disease, weather, market_price).
        Provide actionable advice.
        """
        
        # Build prompt
        prompt = f"{system_instruction}\nContext: {context}\nQuery: {query}\nOutput JSON format: {{'response_text': '...', 'intent': '...', 'actions': [...]}}"
        
        try:
            # Generate content using the new SDK method signature
            # Note: The new SDK usually has models.generate_content
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            # Parse JSON
            try:
                # The response object structure might differ. 
                # constant checking of response.text usually works for the high-level client too.
                result = json.loads(response.text)
                return result
            except json.JSONDecodeError:
                logger.error(f"Failed to parse Gemini JSON: {response.text}")
                # Fallback structure
                return {
                    "response_text": response.text,
                    "intent": "unknown",
                    "actions": []
                }
                
        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            raise e

gemini_service = GeminiService()
