from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query 
from sqlalchemy.orm import Session
from db.database import *
from model.instance_model import *
from crud import instance_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

@router.get("/", response_model = List[InstanceOutSchema])
async def get(db: Session = Depends(get_db)):
    response = await instance_crud.get(db)
    return response

@router.post('/')
async def post(server_data:InstanceInSchema, db: Session = Depends(get_db)):
    response = await instance_crud.post(db,payload=server_data)
    return response

# @router.get("/{id}")
# async def get_service(id: int,db: Session = Depends(get_db)):
#     response = await get(db,id=id)
#     return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
