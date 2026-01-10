
from fastapi import APIRouter

router = APIRouter()

@router.post("/completion")
async def chat_completion():
    return {"reply": "Hello! I am your AgriSakhi assistant."}
