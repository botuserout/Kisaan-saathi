from fastapi import APIRouter
from app.api.v1.endpoints import chat, users, advisory

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(advisory.router, prefix="/advisory", tags=["advisory"])

