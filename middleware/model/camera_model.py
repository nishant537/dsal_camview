import enum 
from pydantic import BaseModel
from typing import Optional


class CameraBaseSchema(BaseModel):
    center_id: int | None = None
    name: str | None = None
    sublocation: str | None = None
    dss_id: int | None = None
    dss_channel: int | None = None

class CameraInSchema(CameraBaseSchema):
    pass

class CameraOutSchema(CameraBaseSchema):
    id: int
    class Config:
        orm_mode = True

class FrameInSchema(BaseModel):
    dss_id: int | None = None
    dss_channel: int | None = None
