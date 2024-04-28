import enum 
from pydantic import BaseModel, Json
from typing import Optional
# from .feature_model import FeatureOutSchema
from datetime import datetime

class StatusTypeEnum(str, enum.Enum):
    pending = "pending"
    marked = "marked"
    approved = "approved"
    rejected = "rejected"

class RoiBaseSchema(BaseModel):
    feature_id: int
    name: str
    comment: str | None = None
    json: Json
    status: StatusTypeEnum = StatusTypeEnum['pending']
    last_updated: datetime = datetime.now()

class RoiInSchema(RoiBaseSchema):
    pass

class RoiOutSchema(RoiBaseSchema):
    id: int
    # exams: list[FeatureOutSchema] = []
    class Config:
        orm_mode = True


