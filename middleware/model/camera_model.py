import enum 
from pydantic import BaseModel
from typing import Optional


class CameraBaseSchema(BaseModel):
    center_id: int
    name: str
    sublocation: str
    dss_id: int
    dss_channel: int

class CameraInSchema(CameraBaseSchema):
    pass

class CameraOutSchema(CameraBaseSchema):
    id: int
    class Config:
        orm_mode = True


