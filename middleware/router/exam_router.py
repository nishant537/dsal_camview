from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query, Request, UploadFile, File
from sqlalchemy.orm import Session
from db.database import *
from model.exam_model import *
from crud import exam_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

@router.get("/{id}")
async def get_exam(id: int, db: Session = Depends(get_db)):
    response = await exam_crud.get_exam(id, db)
    return response

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

@router.post('/upload_center')
async def upload_center(file: UploadFile = File(...), db: Session = Depends(get_db)):
    print(file)
    response = await exam_crud.upload_center(db,file)
    return response

@router.post('/upload_camera')
async def upload_camera(file: UploadFile = File(...), db: Session = Depends(get_db)):
    print(file)
    response = await exam_crud.upload_camera(db,file)
    return response

@router.delete("/{id}")
async def delete(id:int, db: Session = Depends(get_db)):
    response = await exam_crud.delete(db,id=id)
    return response

# @router.get("/{id}")
# async def get_service(id: int,db: Session = Depends(get_db)):
#     response = await get(db,id=id)
#     return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
