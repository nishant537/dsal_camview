from distutils.log import debug
from email import message
from telnetlib import STATUS
from turtle import update
import uvicorn
from fastapi import FastAPI, Depends,status
from typing import Union
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from starlette.responses import PlainTextResponse, RedirectResponse
from db.database import *
# from module import user_module,service_site_module,specification_module,service_spec_module,node_data_module,blockchain_module,ip_lookup_module
from router import exam_router, client_router, shift_router, instance_router, center_router, camera_router, feature_router, roi_router
import os
import time
# from whmcs_data_scheduler import updateDB
# from hv_data_scheduler import updateDB_hv
import asyncio
from threading import Thread
from starlette.middleware.cors import CORSMiddleware


app = FastAPI(title='TrustView')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# AUTO UPDATE DATA
# def start_background_loop(loop):
#     asyncio.set_event_loop(loop)
#     final = asyncio.gather(updateDB(),updateDB_hv())
#     loop.run_until_complete(final)

# loop = asyncio.new_event_loop()
# t = Thread(target=start_background_loop, args=(loop,), daemon=True)
# t.start()

async def get_db():
    db = SessionLocal()
    print("New session created")
    try:
        yield db
    finally:
        db.close()

def ResponseModel(data, message):
    return {
        "success":True,
        "data": data,
        "status_code": 200,
        "message": message,
    }

def ErrorResponseModel(code, message):
    return {"success": False, "status_code": code, "message": message}


@app.get('/')
def index():
    return RedirectResponse(url='/docs')

@app.on_event("startup")
async def startup():
    try:
        await database.connect()
    except:
        return ErrorResponseModel(500, "Internal Server Error")

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(client_router.router, prefix="/client", tags=["Client Data"])
app.include_router(exam_router.router, prefix="/exam", tags=["Exam Data"])
app.include_router(instance_router.router, prefix="/instance", tags=["Instance Data"])
app.include_router(shift_router.router, prefix="/shift", tags=["Shift Data"])
app.include_router(center_router.router, prefix="/center", tags=["Center Data"])
app.include_router(camera_router.router, prefix="/camera", tags=["Camera Data"])
app.include_router(feature_router.router, prefix="/feature", tags=["Feature Data"])
app.include_router(roi_router.router, prefix="/roi", tags=["Roi Data"])
# app.include_router(blockchain_module.router, prefix="/blockchain", tags=["Blockchain Data"])
# app.include_router(protocol_module.router, prefix="/protocol", tags=["Protocol Data"])
# app.include_router(deployment_module.router, prefix="/deployment", tags=["Deployment Data"])
# app.include_router(server_module.router, prefix="/server", tags=["Server Data"])
# app.include_router(service_module.router, prefix="/service", tags=["Service Data"])
# app.include_router(site_module.router, prefix="/site", tags=["Site Data"])
# app.include_router(user_module.router, prefix="/user", tags=["User Data"])
# app.include_router(type_module.router, prefix="/type", tags=["Server Type Data"])

@app.get("/health")
def health_check():
    try:
        check_db = database.connection()
        if check_db:
            return "Ok"
    except Exception as e:
        return "Connection Failed!"

if __name__ == "__main__":
    uvicorn.run("app:app", host='localhost', port='8000')