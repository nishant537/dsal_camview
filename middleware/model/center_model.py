import enum 
from pydantic import BaseModel
from typing import Optional
# from .exam_model import ExamOutSchema


class CenterBaseSchema(BaseModel):
    shift_id: int
    code: str
    name: str
    location: str

class CenterInSchema(CenterBaseSchema):
    pass

class CenterOutSchema(CenterBaseSchema):
    id: int
    # exams: list[ExamOutSchema] = []
    class Config:
        orm_mode = True


