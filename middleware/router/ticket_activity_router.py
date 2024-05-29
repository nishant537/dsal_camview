from distutils.log import debug
from email import message
import json
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request, WebSocket
from sqlalchemy.orm import Session
from db.database import *
from model.ticket_activity_model import *
from crud import ticket_activity_crud
import auth
from typing import Optional, Annotated, List
from sqlalchemy import event
import asyncio

router = APIRouter()
active_connection = "x"

@router.get("/")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await ticket_activity_crud.get(db,request)
    return response

@router.get("/{id}")
async def get(
        id: int,
        db: Session = Depends(get_db)
    ):
    response = await ticket_activity_crud.get_one(db,id)
    return response

@router.post('/')
async def post(server_data:TicketActivityInSchema, db: Session = Depends(get_db)):
    response = await ticket_activity_crud.post(db, payload=server_data)
    return response

@router.put("/")
async def put(id:int ,server_data:TicketActivityInSchema,db: Session = Depends(get_db)):
    response = await ticket_activity_crud.put(db,id=id,payload=server_data)
    return response

@router.delete("/")
async def delete(id:int, db: Session = Depends(get_db)):
    response = await ticket_activity_crud.delete(db,id=id)
    return response
