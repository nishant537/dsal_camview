from json import JSONEncoder
import logging
from sqlalchemy import select, or_, desc
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.alert_activity_model import *
from html_response_codes import *
from crud.ticket_crud import post as post_ticket
from model.ticket_model import *

async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach    
    ):
    params = request.query_params
    print(params)
    alert_data = db.query(Alert).options(joinedload(Alert.activity)).order_by(desc(Alert.id))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        if query=="search":
            alert_data = alert_data.filter(or_(Alert.id.like(params[query]),Alert.center.like(f"%{params[query]}%"),Alert.camera.like(f"%{params[query]}%"), Alert.location.like(f"%{params[query]}%"), Alert.sublocation.like(f"%{params[query]}%"), Alert.feature.like(f"%{params[query]}%")))
        else:
            attr, operator = query.split('__') 
            alert_data = alert_data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    return [[activity_row.__dict__ for activity_row in row.__dict__['activity']] for row in alert_data]

async def get_one(
        db: Session,
        id
    ):
    data = db.query(AlertActivity).options(joinedload(AlertActivity.activity)).filter(AlertActivity.id.__eq__(id))
    print(data.all())
    return data.all()

async def post(db: Session,payload: AlertActivityInSchema):
    data = db.query(Alert).filter_by(id=payload.alert_id).first()
    data.status = payload.status

    if payload.status:
        ticket = db.query(Ticket).filter_by(alert_id=payload.alert_id).first()
        if (payload.status).value=="true":
            if ticket is None:
                await post_ticket(db, TicketInSchema(alert_id=payload.alert_id,center=data.center,camera=data.camera,feature=data.feature,sublocation=data.sublocation))
        else:
            if ticket:
                db.delete(ticket)
                db.commit()

    db_item = AlertActivity(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

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
