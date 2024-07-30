from json import JSONEncoder
import logging
from sqlalchemy import select, or_
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.ticket_model import *
from html_response_codes import *
from crud.ticket_activity_crud import post as post_activity
from model.ticket_activity_model import *
from sqlalchemy.sql import desc


async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach    
    ):
    params = request.query_params
    data = db.query(Ticket).options(joinedload(Ticket.activity), joinedload(Ticket.alert)).order_by(desc(Ticket.alert_id))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Ticket,attr),params[query]))

    print(data.all())
    return data.all()

async def get_group(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    latest_subquery = db.query(func.max(Ticket.alert_id).label('id'),func.count().label('row_count')).group_by(Ticket.camera, Ticket.feature).subquery()
    data = db.query(Ticket, latest_subquery.c.row_count).options(joinedload(Ticket.activity), joinedload(Ticket.alert)).join(latest_subquery, Ticket.alert_id == latest_subquery.c.id)
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        if query=="search":
            data = data.filter(or_(Ticket.id.like(params[query]),Ticket.center.like(f"%{params[query]}%"),Ticket.camera.like(f"%{params[query]}%"),Ticket.feature.like(f"%{params[query]}%"),Ticket.sublocation.like(f"%{params[query]}%")))
        else:
            attr, operator = query.split('__') 
            if attr=="status" or attr=="group_count":
                temp = []
                order = {"insignificant":[0,0], "minor":[0,2],"moderate": [2,5], "major":[5,10]}
                for row in data.all():
                    row = {**row._asdict()['Ticket'].__dict__,**{"group_count":row._asdict()['row_count']}}
                    if attr=="status":
                        if row['activity'][0].__dict__['status'].value==params[query]:
                            temp.append(row)
                    else:
                        if params[query]=="critical":
                            if int(row['group_count'])>=10:
                                temp.append(row)
                        else:
                            if order[params[query]][0]<int(row['group_count'])<=order[params[query]][1]:
                                temp.append(row)
                return temp
            else:
                data = data.filter(get_sqlalchemy_operator(operator)(getattr(Ticket,attr),f"%{params[query]}%" if operator=="like" else params[query]))
    
    return [{**row._asdict()['Ticket'].__dict__,**{"group_count":row._asdict()['row_count']}} for row in data.all()]


async def get_stats(
        db: Session,
        request 
    ):
    params = request.query_params

    print(func.max(TicketActivity.id))
    latest_ticket_subquery = db.query(Ticket.camera, Ticket.feature, func.max(Ticket.id).label('latest_ticket_id')).group_by(Ticket.camera, Ticket.feature).subquery()
    latest_activity_subquery = db.query(TicketActivity.ticket_id,func.max(TicketActivity.id).label("latest_activity_id")).group_by(TicketActivity.ticket_id).subquery()
    data = db.query(Ticket.id, Ticket.center, Ticket.camera, Ticket.feature, Ticket.sublocation, TicketActivity.status, func.count().label("group_count")).join(latest_ticket_subquery, (Ticket.camera == latest_ticket_subquery.c.camera) & (Ticket.feature == latest_ticket_subquery.c.feature) & (Ticket.id == latest_ticket_subquery.c.latest_ticket_id)).join(latest_activity_subquery, Ticket.id == latest_activity_subquery.c.ticket_id).join(TicketActivity, (Ticket.id == TicketActivity.ticket_id) & (TicketActivity.id == latest_activity_subquery.c.latest_activity_id)).group_by(Ticket.camera, Ticket.feature).order_by(desc(Ticket.camera), desc(Ticket.feature))
    # data = db.query(Ticket.id,Ticket.center,Ticket.camera,Ticket.feature,Ticket.sublocation,TicketActivity.status,func.count().label("group_count")).join(latest_activity_subquery,Ticket.id == latest_activity_subquery.c.ticket_id).join(TicketActivity,(Ticket.id == TicketActivity.ticket_id)& (TicketActivity.id == latest_activity_subquery.c.latest_activity_id)).group_by(Ticket.camera,Ticket.feature)

    for query in [x for x in params if params[x] is not None]:
        if query=="search":
            data = data.filter(or_(Ticket.id.like(params[query]),Ticket.center.like(f"%{params[query]}%")))
        else:
            attr, operator = query.split('__') 
            data = data.filter(get_sqlalchemy_operator(operator)(getattr(Ticket,attr),f"%{params[query]}%" if operator=="like" else params[query]))

    print([row._asdict() for row in data.all()])
    return [row._asdict() for row in data.all()]

async def post(db: Session,payload: TicketInSchema):
    db_item = Ticket(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    alert_item = db.get(Alert, payload.alert_id)

    # add ticket activity 
    activity = await post_activity(db, TicketActivityInSchema(ticket_id=db_item.id, last_updated=alert_item.timestamp))

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
