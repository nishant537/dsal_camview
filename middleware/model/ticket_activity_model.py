import enum 
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketActivityStatusEnum(str, enum.Enum):
    new = 'new'
    open = 'open'
    resolved = 'resolved'

class TicketActivityBaseSchema(BaseModel):
    ticket_id: int | None = None
    status: TicketActivityStatusEnum | None = TicketActivityStatusEnum['new']
    comment: str | None = None
    last_updated: datetime| None = datetime.now()

class TicketActivityInSchema(TicketActivityBaseSchema):
    pass

class TicketActivityOutSchema(TicketActivityBaseSchema):
    id: int
    class Config:
        orm_mode = True

