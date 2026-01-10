from app.services.gemini_service import gemini_service
from app.services.firestore_service import firestore_service
import logging

logger = logging.getLogger(__name__)

class AdvisoryEngine:
    async def generate_advisory_for_user(self, uid: str):
        """
        Generates a personalized advisory based on user profile.
        """
        # Fetch Profile
        profile = await firestore_service.get_user_profile(uid)
        if not profile or not profile.get('crops'):
            return None
        
        # Prompt Engineering
        crops = ", ".join(profile.get('crops', []))
        location = profile.get('location', {}).get('district', 'Kerala')
        
        prompt = f"""
        Generate a short agricultural advisory for a farmer in {location} growing {crops}.
        Focus on current weather trends or common pests for this season.
        Output JSON: {{'type': 'weather|pest|market', 'content': '...', 'severity': 'low|medium|high'}}
        """
        
        # Call Gemini
        try:
            # We reuse generate_response but it expects a 'query'. 
            # We can refactor GeminiService or just pass the prompt as query with empty context.
            # Ideally, specific method in GeminiService is better.
            # Using raw call here for simplicity or reusing existing.
            
            # Use the existing method
            result = await gemini_service.generate_response(query=prompt, context=profile)
            
            # Map result keys if necessary. GeminiService follows chat schema.
            # We might need a raw generation method.
            
            return {
                "type": result.get('intent', 'general'), # mapping intent to type
                "content": result.get('response_text', "No advisory generated."),
                "severity": "medium"
            }
        except Exception as e:
            logger.error(f"Advisory generation failed: {e}")
            return None

advisory_engine = AdvisoryEngine()
