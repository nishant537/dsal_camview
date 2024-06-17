import enum 
from pydantic import BaseModel
from typing import Optional
 
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
    type: ExamTypeEnum | None = ExamTypeEnum['live']
    description: str | None = None
    class Config:
        orm_mode = True

class ExamInSchema(ExamBaseSchema):
    pass

class ExamOutSchema(ExamBaseSchema):
    id: int
    class Config:
        orm_mode = True


