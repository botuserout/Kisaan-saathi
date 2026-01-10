from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: Optional[str] = None
    language_pref: str = "ml"
    location: Optional[dict] = None # {lat, long, district}
    crops: List[str] = []

class UserCreate(UserBase):
    pass

class UserUpdate(UserBase):
    pass

class UserInDB(UserBase):
    uid: str
    email: Optional[EmailStr] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class ExportResponse(BaseModel):
    status: str
    download_url: Optional[str] = None
    expiry: Optional[datetime] = None
