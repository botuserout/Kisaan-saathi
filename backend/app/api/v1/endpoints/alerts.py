
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_alerts():
    return [{"id": 1, "type": "Weather", "message": "Heavy rain expected tomorrow.", "severity": "high"}]
