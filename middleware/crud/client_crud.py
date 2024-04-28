from json import JSONEncoder
import logging
from sqlalchemy import select, update, orm
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.client_model import *
from html_response_codes import *
from sqlalchemy_filters import apply_filters



async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    data = db.query(Client).options(joinedload(Client.exams).subqueryload(Exam.instances),joinedload(Client.exams).subqueryload(Exam.shifts))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        print(attr, operator)
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Client,attr),params[query]))

    print(data.all())
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
    data = db.query(Client).filter_by(id=id)
    print(data)
    if not data:
            raise HTTPException(status_code=404, detail="Hero not found")
    # model_dump also takes all default values that might not be passed in post data
    put_data = payload.model_dump(exclude_unset=True)
    data.update(payload)
    print(data)
    # db.add(data)
    # db.commit()
    # db.refresh(data)
    # db_item = db.get(Server, server_id)
    # db_item.name = create_body.name
    # db_item.available = create_body.available
    # db_item.recommended = create_body.recommended    
    # db_item.sites = db_object
    # db.commit()
    # db.refresh(db_item)
    return data

async def delete(db, id):
    data = db.get(Client, id)
    db.delete(data)
    db.commit()
    return data

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
