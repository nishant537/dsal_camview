from distutils.log import debug
from email import message
import json
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request, WebSocket
from sqlalchemy.orm import Session
from db.database import *
from model.ticket_model import *
from crud import ticket_crud
import auth
from typing import Optional, Annotated, List
from sqlalchemy import event
import asyncio

router = APIRouter()

@router.get("/")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await ticket_crud.get(db,request)
    return response

@router.get("/group")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await ticket_crud.get_group(db,request)
    return response

@router.get("/stats")
async def get(
        request: Request,
        db: Session = Depends(get_db)
    ):
    response = await ticket_crud.get_stats(db,request)
    return response

# not in use now can delete
# @router.get("/{id}")
# async def get(
#         id: int,
#         db: Session = Depends(get_db)
#     ):
#     response = await ticket_crud.get_one(db,id)
#     return response

@router.post('/')
async def post(server_data:TicketInSchema, db: Session = Depends(get_db)):
    response = await ticket_crud.post(db,payload=server_data)
    return response

@router.put("/")
async def put(id:int ,server_data:TicketInSchema,db: Session = Depends(get_db)):
    response = await ticket_crud.put(db,id=id,payload=server_data)
    return response

@router.delete("/")
async def delete(id:int, db: Session = Depends(get_db)):
    response = await ticket_crud.delete(db,id=id)
    return response
