import enum 
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# class AlertTypeEnum(str, enum.Enum):
#     supressed = 0
#     active = 1

class AlertBaseSchema(BaseModel):
    feature: str | None = None
    exam: str | None = None
    shift: str | None = None
    center: str | None = None
    location: str | None = None
    camera: str | None = None
    sublocation: str | None = None
    timestamp: datetime| None = datetime.now()
    # status: AlertTypeEnum | None = AlertTypeEnum['active']
    image_path: str | None = None
    video_path: str | None = None
class AlertInSchema(AlertBaseSchema):
    pass

class AlertOutSchema(AlertBaseSchema):
    id: int
    class Config:
        orm_mode = True

