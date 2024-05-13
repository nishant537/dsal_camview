from json import JSONEncoder
import logging
from sqlalchemy import select
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.roi_model import *
from html_response_codes import *


async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
        ):
    params = request.query_params
    data = db.query(Roi).options(joinedload(Roi.feature).subqueryload(Feature.camera))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Roi,attr),params[query]))

    return data.all()

async def post(db: Session,payload: RoiInSchema):
    # db_object = db.query(Exam).filter(Site.id.in_(payload.sites)).all()
    # payload.sites = db_object

    db_item = Roi(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

async def put(db: Session, id, payload):
    db_item = db.query(Roi).where(Roi.id==id)
    update_data = payload.dict(exclude_unset=True)
    db_item.update(update_data)
    db.commit()
    # db.refresh(db_item)
    return db_item.one()

# async def delete(db, server_id):
#     u = db.get(Server, server_id)
#     db.delete(u)
#     db.commit()
#     return u
