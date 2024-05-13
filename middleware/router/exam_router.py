from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request 
from sqlalchemy.orm import Session
from db.database import *
from model.exam_model import *
from crud import exam_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

@router.get("/")
async def get(
    # client_name: int | None = None, 
    # exam_name: Annotated[str | None, Query(description="Exam name",max_length=50)] = None, 
    # exam_code: str | None = None, 
    # start_time: str | None = None, 
    # end_time: str | None = None, 
    # shift_count: int | None = None, 
    # center_count: int | None = None, 
    # instance_count: int | None = None, 
    # client_username: int | None = None ,
    request: Request,
    db: Session = Depends(get_db)):
    response = await exam_crud.get(db, request)
    return response

@router.post('/')
async def post(server_data:ExamInSchema, db: Session = Depends(get_db)):
    response = await exam_crud.post(db,payload=server_data)
    return response

# @router.get("/{id}")
# async def get_service(id: int,db: Session = Depends(get_db)):
#     response = await get(db,id=id)
#     return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
