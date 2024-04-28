import enum 
from pydantic import BaseModel
from typing import Optional
# from .exam_model import ExamOutSchema
from .center_model import CenterOutSchema
from datetime import date, time
 

class ShiftBaseSchema(BaseModel):
    exam_id: int
    code: str
    date: date
    start_time: time
    end_time: time

class ShiftInSchema(ShiftBaseSchema):
    pass

class ShiftOutSchema(ShiftBaseSchema):
    id: int

    # exam: ExamOutSchema
    centers: list[CenterOutSchema] = []
    class Config:
        orm_mode = True


