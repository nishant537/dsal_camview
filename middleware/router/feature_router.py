from distutils.log import debug
from email import message
from telnetlib import STATUS
from urllib import response
from fastapi import APIRouter, Depends, Query 
from sqlalchemy.orm import Session
from db.database import *
from model.feature_model import *
from crud import feature_crud
import auth
from typing import Optional, Annotated, List

router = APIRouter()

@router.get("/", response_model = List[FeatureOutSchema])
async def get(db: Session = Depends(get_db)):
    response = await feature_crud.get(db)
    return response

@router.post('/')
async def post(server_data:FeatureInSchema, db: Session = Depends(get_db)):
    response = await feature_crud.post(db,payload=server_data)
    return response

@router.put("/{id}")
async def put(id: int, payload:FeatureInSchema, db: Session = Depends(get_db)):
    response = await feature_crud.put(db,id, payload)
    return response

@router.delete("/{id}")
async def delete(id:int, db: Session = Depends(get_db)):
    response = await feature_crud.delete(db,id=id)
    return response
# @router.get("/{id}")
# async def get_service(id: int,db: Session = Depends(get_db)):
#     response = await get(db,id=id)
#     return response

# @router.post('/')
# async def add_service(service_data:ServiceSchema,db: Session = Depends(get_db)):
#     response = await post(db,payload=service_data)
#     return response
