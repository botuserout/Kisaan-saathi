
from fastapi import APIRouter

from app.api.v1.endpoints import (
    chat,
    features,
    auth,
    alerts,
    voice,
    weather
)

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(features.router, prefix="/features", tags=["features"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
api_router.include_router(weather.router, prefix="/weather", tags=["weather"])
