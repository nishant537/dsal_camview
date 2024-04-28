import enum 
from pydantic import BaseModel
from typing import Optional
from .shift_model import ShiftOutSchema
from .instance_model import InstanceOutSchema
# from .client_model import ClientOutSchema
 
# This is redundant, already in database.py with table class models
class ExamTypeEnum(str, enum.Enum):
    live = "live"
    alpha = "alpha"
    beta = "beta"


class ExamBaseSchema(BaseModel):
    client_id: int
    name: str
    code: str
    post: str
    type: ExamTypeEnum = ExamTypeEnum['live']
    description: str | None = None
    class Config:
        orm_mode = True

class ExamInSchema(ExamBaseSchema):
    pass

class ExamOutSchema(ExamBaseSchema):
    id: int
    shifts: list[ShiftOutSchema]
    instances: list[InstanceOutSchema]
    # owner = ClientOutSchema
    class Config:
        orm_mode = True


