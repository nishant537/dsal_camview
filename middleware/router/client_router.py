from distutils.log import debug
from email import message
import json
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request, WebSocket
from sqlalchemy.orm import Session
from db.database import *
from model.client_model import *
from crud import client_crud
import auth
from typing import Optional, Annotated, List
from sqlalchemy import event
import asyncio

router = APIRouter()
active_connection = "x"

@router.get("/")
async def get(
        # id: int | None = None,
        # name: Annotated[str | None, Query(description="Client name",max_length=50)] = None, 
        # code: str | None = None,
        # username: str | None = None,
        # instances: int | None = None,
        # active_exams: int | None = None,
        # completed_exams: int | None = None,
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await client_crud.get(db,request)
    return response

@router.post('/')
async def post(server_data:ClientInSchema, db: Session = Depends(get_db)):
    response = await client_crud.post(db,payload=server_data)
    return response

@router.put("/{id}")
async def put(id:int ,server_data:ClientInSchema,db: Session = Depends(get_db)):
    response = await client_crud.put(db,id=id,payload=server_data)
    return response

@router.delete("/{id}")
async def delete(id:int, db: Session = Depends(get_db)):
    response = await client_crud.delete(db,id=id)
    return response

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    global active_connection
    active_connection = websocket
    try:
        while True:
            await websocket.receive_text()  # Keep connection open
    except Exception:
        active_connection = ""


async def send_message(message: str):
    websocket = active_connection
    await websocket.send_text(message)
    return True

@event.listens_for(Client, 'after_insert')
# @event.listens_for(Client, 'after_delete')
# @event.listens_for(Client, 'after_update')
def after_insert_listener(mapper, connection, target):
    target_json = {col: getattr(target, col) for col in target.__dict__ if not col.startswith('_')}
    message = json.dumps(target_json)  # Customize message as needed
    asyncio.create_task(send_message(message))
    