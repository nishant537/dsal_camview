import enum 
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketStatusEnum(str, enum.Enum):
    new = 'new'
    open = 'open'
    resolved = 'resolved'

class TicketBaseSchema(BaseModel):
    alert_id: int | None = None
    center: str | None = None
    camera: str | None = None
    feature: str | None = None
    sublocation: str | None = None

class TicketInSchema(TicketBaseSchema):
    pass

class TicketOutSchema(TicketBaseSchema):
    id: int
    class Config:
        orm_mode = True

