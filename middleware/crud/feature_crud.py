from json import JSONEncoder
import logging
from sqlalchemy import select
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.feature_model import *
from html_response_codes import *


async def get(db: Session):
    data = db.query(Feature)
    # data = data.join(Server.types).filter(
    #         Type.id == type_id
    #     )
    # data = data.options(joinedload(Server.sites))
    # data = data.options(joinedload(Server.types))
    return data.all()

async def post(db: Session,payload: FeatureInSchema):
    # db_object = db.query(Exam).filter(Site.id.in_(payload.sites)).all()
    # payload.sites = db_object

    db_item = Feature(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


async def delete(db, id):
    data = db.get(Feature, id)
    db.delete(data)
    db.commit()
    return data