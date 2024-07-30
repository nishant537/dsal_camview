import enum 
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertActivityStatusEnum(str, enum.Enum):
    true = 'true'
    false = 'false'

class AlertActivityBaseSchema(BaseModel):
    alert_id: int | None = None
    comment: str | None = None
    status: AlertActivityStatusEnum | None = None
    # last_updated: datetime| None = datetime.now()

class AlertActivityInSchema(AlertActivityBaseSchema):
    pass

class AlertActivityOutSchema(AlertActivityBaseSchema):
    id: int
    class Config:
        orm_mode = True

