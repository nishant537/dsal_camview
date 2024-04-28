from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from db.database import *
from model.client_model import *
from crud import client_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

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

@router.put("/")
async def put(id:int ,server_data:ClientInSchema,db: Session = Depends(get_db)):
    response = await client_crud.put(db,id=id,payload=server_data)
    return response

@router.delete("/")
async def delete(id:int, db: Session = Depends(get_db)):
    response = await client_crud.delete(db,id=id)
    return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
