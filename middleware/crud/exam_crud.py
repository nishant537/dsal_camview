from json import JSONEncoder
import logging
from sqlalchemy import select, func, or_
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile, File
from sqlalchemy.orm import joinedload
from model.exam_model import *
from html_response_codes import *


async def get_exam(id,db: Session,):
    db_item = db.query(Exam).options(joinedload(Exam.client),joinedload(Exam.instances),joinedload(Exam.shifts).subqueryload(Shift.centers)).filter(Exam.id == id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Exam not found")
    return db_item

async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach

    ):
    params = request.query_params
    data = db.query(Exam).options(joinedload(Exam.client),joinedload(Exam.instances),joinedload(Exam.shifts).subqueryload(Shift.centers))

    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        if query=="search":
            data = data.filter(or_(Exam.name.like(f"%{params[query]}%"),Exam.client_name.like(f"%{params[query]}%"), Exam.code.like(f"%{params[query]}%")))
        else:
            attr, operator = query.split('__') 
            data = data.filter(get_sqlalchemy_operator(operator)(getattr(Exam,attr),f"%{params[query]}%" if operator=="like" else params[query]))

    # with association_proxy
    # data = data.filter(Exam.username.like('string'))
    # with has approach for nested searching
    # data = data.filter(Exam.client.has(name='string'))
    # with join approach
    # data = data.join(Exam.client).filter_by(name='string')

    # for length of children
    # data = data.join(Shift).group_by(Exam.id).having(func.count(Shift.id) == 4)
    return data.all()

async def post(db: Session,payload: ExamInSchema):
    print(payload)
    db_item = Exam(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    db_item = db.query(Exam).options(joinedload(Exam.client),joinedload(Exam.instances),joinedload(Exam.shifts).subqueryload(Shift.centers)).filter(Exam.id == db_item.id).first()
    return db_item

async def get_plan(db: Session,payload: ExamInSchema):
    print(payload)
    db_item = Exam(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

async def upload_center(db: Session,file: UploadFile = File(...)):
    content = await file.read()
    return {"filename": file.filename}

async def upload_camera(db: Session,file: UploadFile = File(...)):
    content = await file.read()
    return {"filename": file.filename}