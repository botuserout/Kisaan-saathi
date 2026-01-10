from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class AdvisoryBase(BaseModel):
    type: str # weather, crop_disease, market
    content: str
    severity: str = "customary"

class AdvisoryCreate(AdvisoryBase):
    user_id: str

class AdvisoryResponse(AdvisoryBase):
    id: str
    user_id: str
    created_at: datetime
    read: bool = False

class AlertCreate(BaseModel):
    title: str
    message: str
    severity: str = "high"
    target_region: str
    valid_until: Optional[datetime] = None

class AlertResponse(AlertCreate):
    id: str
    created_at: datetime
