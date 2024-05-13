from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from db.database import *
from model.camera_model import *
from crud import camera_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

@router.get("/")
async def get(
    request: Request,
    db: Session = Depends(get_db)
    ):
    response = await camera_crud.get(db, request)
    return response

@router.post('/')
async def post(server_data:CameraInSchema, db: Session = Depends(get_db)):
    response = await camera_crud.post(db,payload=server_data)
    return response

# @router.get("/{id}")
# async def get_service(id: int,db: Session = Depends(get_db)):
#     response = await get(db,id=id)
#     return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
