import enum 
from pydantic import BaseModel
from typing import Optional


class FeatureBaseSchema(BaseModel):
    camera_id: int
    name: str
    json: str

class FeatureInSchema(FeatureBaseSchema):
    pass

class FeatureOutSchema(FeatureBaseSchema):
    id: int
    class Config:
        orm_mode = True


