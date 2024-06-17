from json import JSONEncoder
import logging
from sqlalchemy import select, update, orm, or_
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.client_model import *
from html_response_codes import *
from sqlalchemy.sql.expression import func


async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    data = db.query(Client).options(joinedload(Client.exams).subqueryload(Exam.instances),joinedload(Client.exams).subqueryload(Exam.shifts))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        if query=="search":
            data = data.filter(or_(Client.name.like(f"%{params[query]}%"),Client.address.like(f"%{params[query]}%"), Client.code.like(f"%{params[query]}%"), Client.username.like(f"%{params[query]}%"), Client.password.like(f"%{params[query]}%")))
        else: 
            attr, operator = query.split('__') 
            data = data.filter(get_sqlalchemy_operator(operator)(getattr(Client,attr),f"%{params[query]}%" if operator=="like" else params[query]))

    return data.all()

async def post(db: Session,payload: ClientInSchema):
    print(payload)
    # db_object = db.query(Exam).filter(Site.id.in_(payload.sites)).all()
    # payload.sites = db_object
    db_item = Client(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

async def put(db: Session,id: id, payload: ClientInSchema):
    db_item = db.query(Client).filter(Client.id == id).first()
    print(payload)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Client not found")
    db_item.name = payload.name
    db_item.address = payload.address
    db_item.code = payload.code
    db_item.username = payload.username
    db_item.password = payload.password
    db.commit()
    db.refresh(db_item)
    return db_item

async def delete(db, id):
    data = db.get(Client, id)
    db.delete(data)
    db.commit()
    return data