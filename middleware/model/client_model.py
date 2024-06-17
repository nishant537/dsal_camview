import enum 
from pydantic import BaseModel
from typing import Optional


class ClientBaseSchema(BaseModel):
    name: str
    address: str | None = None
    code: str
    username: str
    password: str

class ClientInSchema(ClientBaseSchema):
    pass

class ClientOutSchema(ClientBaseSchema):
    id: int
    class Config:
        orm_mode = True

