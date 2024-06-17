import enum 
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StatusTypeEnum(str, enum.Enum):
    pending = "pending"
    marked = "marked"
    approved = "approved"
    rejected = "rejected"

class RoiBaseSchema(BaseModel):
    feature_id: int | None = None
    name: str | None = None
    comment: str | None = None
    json: str | None = None
    status: StatusTypeEnum | None = StatusTypeEnum['pending']
    last_updated: datetime| None = datetime.now()

class   RoiInSchema(RoiBaseSchema):
    pass

class RoiOutSchema(RoiBaseSchema):
    id: int
    class Config:
        orm_mode = True


