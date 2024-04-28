import enum 
from pydantic import BaseModel, Json
from typing import Optional
# from .exam_model import ExamOutSchema


class FeatureBaseSchema(BaseModel):
    camera_id: int
    name: str
    blob: Json

class FeatureInSchema(FeatureBaseSchema):
    pass

class FeatureOutSchema(FeatureBaseSchema):
    id: int
    # exams: list[ExamOutSchema] = []
    class Config:
        orm_mode = True


