import enum 
from pydantic import BaseModel
from typing import Optional
from .feature_model import FeatureOutSchema


class CameraBaseSchema(BaseModel):
    center_id: int
    name: str
    dss_id: int
    channel: int

class CameraInSchema(CameraBaseSchema):
    pass

class CameraOutSchema(CameraBaseSchema):
    id: int
    features: list[FeatureOutSchema] = []
    class Config:
        orm_mode = True


