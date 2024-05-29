from json import JSONEncoder
import logging
from sqlalchemy import select, update, orm
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload
from model.alert_model import *
from html_response_codes import *
from sqlalchemy.sql.expression import func
from sqlalchemy import text, desc
from crud.ticket_crud import post as post_ticket
from model.ticket_model import *
from crud.alert_activity_crud import post as post_activity
from model.alert_activity_model import *

async def get(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    data = db.query(Alert).options(joinedload(Alert.activity))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    return data.all()

async def get_group(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    # grouping on camera~feature so I only see unique places in alert page, this is same as camera~sublocation~feature as every camera at diff sublocation would have diff name
    # data = db.query(Alert.id, Alert.camera,Alert.location,Alert.feature, Alert.image_path,Alert.video_path, func.count().label('group_count'),func.max(Alert.timestamp).label('timestamp')).options(joinedload(Alert.activity)).group_by(Alert.camera,Alert.feature).order_by(func.count().desc())
    # cannot get count for priority and latest timestamp
    data = db.query(Alert).options(joinedload(Alert.activity)).group_by(Alert.camera,Alert.feature).order_by(func.count().desc())
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    return data.all()

async def get_summary(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    print(params)
    # since now using particular day alerts, data to be hourly, when taken date range make it daily basis (use uncommented instead).
    # data = db.query(func.date(Alert.timestamp).label('daily'),Alert.feature,func.count().label('count')).group_by(func.date(Alert.timestamp), Alert.feature)
    data = db.query(func.concat(func.hour(Alert.timestamp), ':00').label('daily'),Alert.feature,func.count().label('count')).group_by('daily', 'feature')
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    # select concat(hour(alert_timestamp),':00') as daily,feature_type, count(*) from all_alert group by daily,feature_type;
    # print(new.mappings().all())
    print([row._asdict() for row in data.all()])
    d = {}
    for i in [row._asdict() for row in data.all()]:
        if i['feature'] not in d:
            d[i['feature']] = {i:0 for i in [f"{i}:00" for i in range(24)]}
        d[i['feature']][i['daily']] = i['count']

    return d


async def get_stats(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    data = db.query(Alert.id,Alert.center,Alert.feature,Alert.sublocation,AlertActivity.status,func.count().label("count")).join(AlertActivity,Alert.id == AlertActivity.alert_id).group_by(Alert.feature,Alert.sublocation,AlertActivity.status)
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    print([row._asdict() for row in data.all()])
    return [row._asdict() for row in data.all()]

async def get_review(
        db: Session,
        request # *******SETBACK******* = in documentation query parameters are not specified with this approach
    ):
    # using joinedLoad instead of response_model to only fetch required data
    params = request.query_params
    data = db.query(AlertActivity).options(joinedload(AlertActivity.alert))
    # for instances, active_exams would need to iterate through results as filter by cannot filter
    for query in [x for x in params if params[x] is not None]:
        attr, operator = query.split('__') 
        data = data.filter(get_sqlalchemy_operator(operator)(getattr(Alert,attr),params[query]))

    return data.all()


async def post(db: Session,payload: AlertInSchema):
    # db_object = db.query(Exam).filter(Site.id.in_(payload.sites)).all()
    # payload.sites = db_object
    db_item = Alert(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)

    # add a ticket
    ticket = await post_ticket(db, TicketInSchema(alert_id=db_item.id,camera=payload.camera,feature=payload.feature))

    # add a status
    activity = await post_activity(db, AlertActivityInSchema(alert_id=db_item.id))
    
    print(db_item.id)
    return db_item

async def put(db: Session,id: id, payload: AlertInSchema):
    data = db.query(Alert).filter_by(id=id)
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
    data = db.get(Alert, id)
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
