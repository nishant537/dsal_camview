import enum 
from pydantic import BaseModel
from typing import Optional
# from .exam_model import ExamOutSchema


class InstanceBaseSchema(BaseModel):
    exam_id: int
    key: str

class InstanceInSchema(InstanceBaseSchema):
    pass

class InstanceOutSchema(InstanceBaseSchema):
    id: int
    # exam: list[ExamOutSchema] = []
    class Config:
        orm_mode = True


