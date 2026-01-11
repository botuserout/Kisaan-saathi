
from fastapi import APIRouter

from app.api.v1.endpoints import weather, chat, advisory, auth, users, features, voice, upload

api_router = APIRouter()
api_router.include_router(weather.router, prefix="/weather", tags=["weather"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(advisory.router, prefix="/advisory", tags=["advisory"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(features.router, prefix="/features", tags=["features"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
