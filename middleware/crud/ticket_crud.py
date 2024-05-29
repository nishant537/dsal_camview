from json import JSONEncoder
import logging
from sqlalchemy import select
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.ticket_model import *
from html_response_codes import *
from crud.ticket_activity_crud import post as post_activity
from model.ticket_activity_model import *


async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach    
    ):
    params = request.query_params
    data = db.query(Ticket).options(joinedload(Ticket.activity), joinedload(Ticket.alert))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        print(params[query])
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Ticket,attr),params[query]))

    return data.all()

async def get_group(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    latest_subquery = db.query(func.max(Ticket.id).label('id')).group_by(Ticket.camera, Ticket.feature).subquery()
    data = db.query(Ticket).options(joinedload(Ticket.activity), joinedload(Ticket.alert)).join(latest_subquery, Ticket.id == latest_subquery.c.id)
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    print([row.__dict__ for row in data.all()])
    return data.all()

# not in use now, can delete
# async def get_one(
#         db: Session,
#         id
#     ):
#     data = db.query(Ticket).options(joinedload(Ticket.activity), joinedload(Ticket.alert)).filter(Ticket.id.__eq__(id))

#     count_data = db.query(Ticket.id).filter(Ticket.feature.__eq__(data.first().feature),Ticket.camera.__eq__(data.first().camera))
#     return {"ticket_data":data.first(),"count_data":[row._asdict()['id'] for row in count_data.all()]}

async def get_stats(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params

    # further query is grouped to get this
    # SELECT t.*, ta.status FROM ticket t INNER JOIN ticket_activity ta ON ta.ticket_id = t.id INNER JOIN (SELECT t.camera, t.feature, t.sublocation, MAX(ta.id) AS latest_id FROM ticket t INNER JOIN ticket_activity ta ON ta.ticket_id = t.id GROUP BY t.camera, t.feature, t.sublocation) AS latest_activity ON t.camera = latest_activity.camera AND t.feature = latest_activity.feature AND t.sublocation = latest_activity.sublocation AND ta.id = latest_activity.latest_id

    latest_activity_subquery = (db.query(Ticket.camera,Ticket.feature,Ticket.sublocation,func.max(TicketActivity.id).label('latest_id')).join(TicketActivity, TicketActivity.ticket_id == Ticket.id).group_by(Ticket.camera, Ticket.feature, Ticket.sublocation).subquery())   
    main_query = (db.query(Ticket, TicketActivity.status).join(TicketActivity, TicketActivity.ticket_id == Ticket.id).join(latest_activity_subquery,(Ticket.camera == latest_activity_subquery.c.camera) &(Ticket.feature == latest_activity_subquery.c.feature) &(Ticket.sublocation == latest_activity_subquery.c.sublocation) &(TicketActivity.id == latest_activity_subquery.c.latest_id)))
    data = (main_query.group_by(Ticket.feature,Ticket.sublocation,TicketActivity.status).with_entities(Ticket.feature,Ticket.sublocation,TicketActivity.status,func.count().label('count')))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    return [row._asdict() for row in data.all()]

async def post(db: Session,payload: TicketInSchema):
    db_item = Ticket(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # add ticket activity 
    activity = await post_activity(db, TicketActivityInSchema(ticket_id=db_item.id))

    print(db_item.id)
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
