import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AgriSakhi Backend"
    API_V1_STR: str = "/api/v1"
    
    # Security
    GEMINI_API_KEY: str
    FIREBASE_CREDENTIALS_PATH: str = "service-account.json"
    LOG_LEVEL: str = "INFO"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
