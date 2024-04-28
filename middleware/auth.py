# auth.py
from fastapi.security.api_key import APIKeyHeader
from fastapi import Security, HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED
from html_response_codes import *
import os

api_key_header = APIKeyHeader(name="token", auto_error=False)
APITOKEN = os.environ.get('TOKEN')

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == "bzARDatkDXorjXpd3yiwhz6LAcpAnrGy3agckFpR":
        return api_key_header   
    else:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ErrorResponseModel(401, 'Unauthorized Access'))
