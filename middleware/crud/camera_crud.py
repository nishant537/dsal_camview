from json import JSONEncoder
import logging
from sqlalchemy import select, or_
from db.database import *
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Response
from sqlalchemy.orm import joinedload
from model.camera_model import *
from html_response_codes import *
from dss_rtsp import DSS_RTSP
import cv2
import datetime


async def get(
        db: Session,
        request 
    ):
    params = request.query_params
    data = db.query(Camera).options(joinedload(Camera.features).subqueryload(Feature.roi),joinedload(Camera.center))
    
    # for filtering through features in exam, change data query to have feature_names attr in data objects
    for query in [x for x in params if params[x] is not None]:
        if query=="search":
            data = data.filter(or_(Camera.center_code.like(f"%{params[query]}%"),Camera.name.like(f"%{params[query]}%"),Camera.sublocation.like(f"%{params[query]}%")))
        else:
            attr, operator = query.split('__') 
            data = data.filter(get_sqlalchemy_operator(operator)(getattr(Camera,attr),f"%{params[query]}%" if operator=="like" else params[query]))

    return data.all()

async def post(db: Session,payload: CameraInSchema):
    # db_object = db.query(Exam).filter(Site.id.in_(payload.sites)).all()
    # payload.sites = db_object

    db_item = Camera(**payload.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

async def fetch_frame(db: Session,payload: FrameInSchema):
    print(payload)
    try:
        rtsp = DSS_RTSP().get_rtsp(int(payload.dss_id),int(payload.dss_channel))
        cap = cv2.VideoCapture(rtsp)

        for i in range(30):
            ret, frame = cap.read()
        image_bytes = cv2.imencode('.jpg', frame)[1].tobytes()
        cap.release()
        cv2.destroyAllWindows()
        logging.info(f"{datetime.datetime.now().strftime('%d-%m-%Y %H-%M-%S')}  `get_frame()`, Image returned")
        return Response(content=image_bytes, media_type="image/png")
    except Exception as e:
        logging.error(f"{datetime.datetime.now().strftime('%d-%m-%Y %H-%M-%S')}  `get_frame()`, Error fetching data!", e)
        return ErrorResponseModel(400, 'Bad Request')

async def put(db, id, payload):
    db_item = db.query(Camera).where(Camera.id==id)
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
