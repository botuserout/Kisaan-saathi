from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from app.core.security import get_current_user
from app.models.advisory import AdvisoryResponse, AlertCreate, AlertResponse
from app.services.advisory_engine import advisory_engine
from app.services.firestore_service import firestore_service
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/generate", status_code=202)
async def trigger_advisory_generation(
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Trigger async generation of advisory for the current user.
    """
    uid = current_user['uid']
    # Add to background task
    background_tasks.add_task(advisory_engine.generate_advisory_for_user, uid)
    return {"message": "Advisory generation started"}

@router.get("/my", response_model=list[AdvisoryResponse])
async def get_my_advisories(current_user: dict = Depends(get_current_user)):
    """
    Get usage history advisories.
    Implementation pending in FirestoreService.
    """
    return []

@router.post("/alerts", response_model=AlertResponse)
async def publish_alert(
    alert_in: AlertCreate,
    # In real app, restrict to Admin
    current_user: dict = Depends(get_current_user) 
):
    """
    Publish a real-time alert (Admin only).
    """
    # Save to Firestore 'alerts' collection
    # Frontend listeners will pick this up automatically
    alert_data = alert_in.model_dump()
    alert_data['created_at'] = datetime.utcnow()
    alert_id = str(uuid.uuid4())
    
    # firestore_service.publish_alert(alert_id, alert_data) # To implement
    
    return AlertResponse(id=alert_id, **alert_data)
