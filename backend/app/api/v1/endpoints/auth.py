
from fastapi import APIRouter

router = APIRouter()

@router.post("/verify-token")
async def verify_token():
    return {"status": "verified", "role": "user"}
