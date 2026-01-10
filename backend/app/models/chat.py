from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatRequest(BaseModel):
    query_text: str
    audio_url: Optional[str] = None
    language: str = "ml"  # Default to Malayalam

class RecommendedAction(BaseModel):
    action: str
    priority: str

class ChatResponse(BaseModel):
    response_text: str
    intent: str
    recommended_actions: List[str] = []
    
class ConversationLog(BaseModel):
    id: Optional[str] = None
    user_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    user_query: str
    bot_response: str
    intent: str
    language: str
    metadata: Dict[str, Any] = {}
