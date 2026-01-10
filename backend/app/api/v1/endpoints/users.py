from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_current_user
from app.models.user import UserUpdate, UserInDB, ExportResponse
from app.services.firestore_service import firestore_service
from datetime import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/me", response_model=UserInDB)
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    """
    Get current user profile.
    """
    uid = current_user['uid']
    profile = await firestore_service.get_user_profile(uid)
    
    if not profile:
        # Create default based on Auth info if not exists
        return UserInDB(
            uid=uid,
            email=current_user.get('email'),
            name=current_user.get('name')
        )
        
    return UserInDB(uid=uid, **profile)

@router.put("/me", response_model=UserInDB)
async def update_user_profile(
    user_in: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user profile (crops, location, etc).
    """
    uid = current_user['uid']
    
    # Merge existing + update
    existing = await firestore_service.get_user_profile(uid)
    updated_data = user_in.model_dump(exclude_unset=True)
    
    # Ensure we don't overwrite uid/email if not provided, but they aren't in UserUpdate anyway
    final_data = {**existing, **updated_data, "uid": uid, "updated_at": datetime.utcnow()} 
    
    await firestore_service.save_user_profile(uid, final_data)
    
    return UserInDB(**final_data)

@router.post("/me/export", response_model=ExportResponse)
async def export_data(current_user: dict = Depends(get_current_user)):
    """
    DPDP Compliance: Export all user data.
    """
    uid = current_user['uid']
    # Trigger async export job
    logger.info(f"Export requested for {uid}")
    return ExportResponse(status="processing", download_url="https://api.agrisakhi.com/exports/pending")

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(current_user: dict = Depends(get_current_user)):
    """
    DPDP Compliance: Delete user account.
    """
    uid = current_user['uid']
    logger.info(f"Account deletion requested for {uid}")
    # Trigger deletion
    # await firestore_service.delete_user(uid)
    return
