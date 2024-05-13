from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from db.database import *
from model.roi_model import *
from crud import roi_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

@router.get("/")
async def get(
    request: Request,
    db: Session = Depends(get_db)
    ):
    response = await roi_crud.get(db, request)
    return response

@router.post('/')
async def post(payload:RoiInSchema, db: Session = Depends(get_db)):
    response = await roi_crud.post(db,payload)

    return response

@router.put("/{id}")
async def put(id: int, payload:RoiInSchema, db: Session = Depends(get_db)):
    response = await roi_crud.put(db,id, payload)
    return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
