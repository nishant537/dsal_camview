from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query 
from sqlalchemy.orm import Session
from db.database import *
from model.shift_model import *
from crud import shift_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

@router.get("/")
async def get(
    exam_name: str | None = None,
    code: str | None = None,
    date: str | None = None,
    start_time: str | None = None,
    end_time: str | None = None,
    centers: int | None = None,
    cameras: int | None = None,
    db: Session = Depends(get_db)):
    response = await shift_crud.get(db,exam_name,code,date,start_time,end_time,centers,cameras)
    return response

@router.post('/')
async def post(server_data:ShiftInSchema, db: Session = Depends(get_db)):
    response = await shift_crud.post(db,payload=server_data)
    return response

# @router.get("/{id}")
# async def get_service(id: int,db: Session = Depends(get_db)):
#     response = await get(db,id=id)
#     return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
