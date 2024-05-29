from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from db.database import *
from model.alert_model import *
from crud import alert_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()


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
