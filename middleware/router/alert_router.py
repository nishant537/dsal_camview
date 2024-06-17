from distutils.log import debug
from email import message
import json
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request, WebSocket
from sqlalchemy.orm import Session
from db.database import *
from model.alert_model import *
from crud import alert_crud
import auth
from typing import Optional, Annotated, List
from sqlalchemy import event
import asyncio

router = APIRouter()
active_connection = "y"

@router.get("/")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await alert_crud.get(db,request)
    return response

@router.get("/group")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await alert_crud.get_group(db,request)
    return response

@router.get("/summary")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await alert_crud.get_summary(db,request)
    return response

@router.get("/stats")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await alert_crud.get_stats(db,request)
    return response

@router.get("/review")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await alert_crud.get_review(db,request)
    return response

@router.post('/')
async def post(server_data:AlertInSchema, db: Session = Depends(get_db)):
    response = await alert_crud.post(db,payload=server_data)
    return response

@router.put("/")
async def put(id:int ,server_data:AlertInSchema,db: Session = Depends(get_db)):
    response = await alert_crud.put(db,id=id,payload=server_data)
    return response

@router.delete("/")
async def delete(id:int, db: Session = Depends(get_db)):
    response = await alert_crud.delete(db,id=id)
    return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response

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

# for json dumping datetime object
def datetime_serializer(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()  # Convert datetime to ISO 8601 format
    raise TypeError("Type not serializable")

@event.listens_for(Alert, 'after_insert')
def after_insert_listener(mapper, connection, target):
    target_json = {col: getattr(target, col) for col in target.__dict__ if not col.startswith('_')}
    message = json.dumps(target_json,default=datetime_serializer)  # Customize message as needed
    asyncio.create_task(send_message(message))
    