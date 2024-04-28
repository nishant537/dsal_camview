import enum 
from pydantic import BaseModel
from typing import Optional


class ClientBaseSchema(BaseModel):
    code: str
    name: str
    address: str
    username: str
    password: str

class ClientInSchema(ClientBaseSchema):
    pass

class ClientOutSchema(ClientBaseSchema):
    id: int
    class Config:
        orm_mode = True

