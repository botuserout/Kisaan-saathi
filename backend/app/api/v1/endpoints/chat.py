from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.models.chat import ChatRequest, ChatResponse, ConversationLog
from app.services.gemini_service import gemini_service
from app.services.firestore_service import firestore_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/query", response_model=ChatResponse)
async def chat_query(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    uid = current_user['uid']
    logger.info(f"User {uid} querying: {request.query_text}")
    
    # 1. Fetch User Context
    user_profile = await firestore_service.get_user_profile(uid)
    
    # 2. Call AI
    try:
        ai_response = await gemini_service.generate_response(
            query=request.query_text,
            context=user_profile
        )
    except Exception as e:
        logger.error(f"AI generation failed: {e}")
        raise HTTPException(status_code=503, detail="AI Service unavailable")
        
    # 3. Construct Response
    response_model = ChatResponse(
        response_text=ai_response.get('response_text', "Error generating response"),
        intent=ai_response.get('intent', 'unknown'),
        recommended_actions=ai_response.get('actions', [])
    )
    
    # 4. Save to History (Async)
    log = ConversationLog(
        user_id=uid,
        user_query=request.query_text,
        bot_response=response_model.response_text,
        intent=response_model.intent,
        language=request.language
    )
    # Fire and forget or await depending on strictness
    await firestore_service.save_conversation(uid, log.model_dump())
    
    return response_model
