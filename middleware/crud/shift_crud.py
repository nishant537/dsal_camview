from json import JSONEncoder
import logging
from sqlalchemy import select, or_
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.shift_model import *
from html_response_codes import *


async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    params = request.query_params
    data = db.query(Shift).options(joinedload(Shift.exam),joinedload(Shift.centers).subqueryload(Center.cameras))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        if query=="search":
            data = data.filter(or_(Shift.code.like(f"%{params[query]}%"),Shift.exam_name.like(f"%{params[query]}%"), Shift.date.like(f"%{params[query]}%")))
        else:
            attr, operator = query.split('__') 
            data = data.filter(get_sqlalchemy_operator(operator)(getattr(Shift,attr),f"%{params[query]}%" if operator=="like" else params[query]))

    return data.all()

async def post(db: Session,shifts: list[ShiftInSchema]):
    # db_object = db.query(Exam).filter(Site.id.in_(payload.sites)).all()
    # payload.sites = db_object
    created_items = []
    db_items = []
    for shift in shifts:
        db_item = Shift(**shift.dict())
        db_items.append(db_item)
        db.add(db_item)

    db.commit()

    for db_item in db_items:
        db.refresh(db_item)
        created_items.append(db_item)

    return created_items

# async def put(db, create_body, server_id):
#     db_object = db.query(Site).filter(Site.id.in_(create_body.sites)).all()

#     db_item = db.get(Server, server_id)
#     db_item.name = create_body.name
#     db_item.available = create_body.available
#     db_item.recommended = create_body.recommended    
#     db_item.sites = db_object
#     db.commit()
#     db.refresh(db_item)
#     return db_item

# async def delete(db, server_id):
#     u = db.get(Server, server_id)
#     db.delete(u)
#     db.commit()
#     return u

# async def add_server_service(db: Session, create_body):
#     server_service = ServerService(**create_body.dict())
#     db.add(server_service)
#     db.commit()
#     db.refresh(server_service)
#     return server_service


# async def list_server_service(db: Session):
#     return db.query(ServerService).all()


# async def get_all_services(db: Session, query_params: GetService):
#     server_services = (
#         db.query(ServerService)
#         .filter(
#             ServerService.server_id == query_params.server_id,
#             ServerService.site_id == query_params.site_id
#         )
#         .all()
#     )
#     if server_services:

#         def _get_service(server_service):
#             service = db.query(Service).filter(Service.id == server_service.service_id).first()
#             return ServiceParse(**service.__dict__)

#         _server_services = list(map(_get_service, server_services))
#         return _server_services
#     raise HTTPException(
#         status_code=status.HTTP_409_CONFLICT,
#         detail={
#             "status_code": status.HTTP_409_CONFLICT,
#             "message": f"ServerService doesn't exist",
#         },
#     )
