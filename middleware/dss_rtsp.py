import requests
import json
import hashlib
import base64
import time

class DSS_RTSP:
    def __init__(self) -> None:
        self.DSS_IP = "13.202.40.56"
        self.stream_type = "2"
        self.username = "system"
        self.password = "Sasd@123456"
    
    def header1(self):
        url = f"http://{self.DSS_IP}/admin/API/accounts/authorize"
        headers = {
        'Host': f'{self.DSS_IP}',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8'
    }
    #2 第一次构造请求体
        data = {
        "userName": "system",
        "ipAddress": "",
        "clientType": "WINPC_V2"
    }
    #3 发送POST请求
        response = requests.post(url, headers=headers, data=json.dumps(data))
    # 解析响应数据
        result1 = json.loads(response.text)
        return url,headers,result1


    def header2(self, url, headers, result1):
        ## 构造第二次鉴权请求体
        #1生成signature

        userName = self.username
        password = self.password
        #随机数从第一次平台返回中获取
        realm = result1['realm']
        randomKey = result1['randomKey']
        # 计算 temp1
        md5 = hashlib.md5()
        md5.update(password.encode('utf-8'))
        temp1 = md5.hexdigest()

        # 计算 temp2
        md5 = hashlib.md5()
        md5.update((userName + temp1).encode('utf-8'))
        temp2 = md5.hexdigest()

        # 计算 temp3
        md5 = hashlib.md5()
        md5.update(temp2.encode('utf-8'))
        temp3 = md5.hexdigest()

        # 计算 temp4
        md5 = hashlib.md5()
        md5.update((userName + ':' + realm + ':' + temp3).encode('utf-8'))
        temp4 = md5.hexdigest()

        # 计算 signature
        md5 = hashlib.md5()
        md5.update((temp4 + ':' + randomKey).encode('utf-8'))
        signature = md5.hexdigest()

        #2生成publicky，已生成(预览接口用不到,仅拉流可忽略)
        #3randomKey从第一次平台返回中获取
        #4构建第二次鉴权data
        data2 = {
        #可选
        "mac": "2C:F0:5D:1D:17:85",
        #"mac": "2C:F0:5D:1D:17:85",
        #"mac": "18-5E-0F-C4-AF-22",
        # 必填1
        "signature": signature,
        "userName": userName,
        # 必填2，从第一次请求回复中获取，字典的key
        "randomKey": result1['randomKey'],
        # 必填3
        "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkshUGp8dWy2YfJ94V+82MIktpNo0qbnnm6LuqLOCc04jucyS+tew9vbXGVimMJpxbCmVZxiY07ObnafbxOoGmxNnwNg9QwNPlATXP4XRWEdaGIJSuAm2HG/uNoKmHeTWATF40JMJa440iP7U7ir6vrIx/SX7rGMhYHsHEaz6+kmu6vnaTPISAXtAdMqawddeTTQlyM3tHUNLKeed3pPiT9OqW8KzaqAYK4A3ZmHfH0yvUxXrZTuDic7noCUSzFb5C5vsOebxn7XO0NogBO1vBEqebQcoQupG94n8GYdlFemlWlp9V9HrkfcSqkbrRF0/sf3EMYc0ujsVR8aiuMfBkQIDAQAB",
        "encryptType": "MD5",
        "ipAddress": "",
        "clientType": "WINPC_V2",
        "userType": "0"
    }

        #5 发送POST请求
        response2 = requests.post(url, headers=headers, data=json.dumps(data2))
        # 解析响应数据
        result2 = json.loads(response2.text)
        return result2

    ##获取到tocken后，心跳保活,保活超时为30s，设置22s发送一次保活

    def header3(self, result2):
        url3 = f"http://{self.DSS_IP}/admin/API/accounts/keepalive"
        headers3 = {
        'Host': f'{self.DSS_IP}',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-Subject-Token' : result2['token']
    }
    #2 第一次构造请求体
        data3 = {
        "token": result2['token'],
        "duration": 30
    }
    #3 发送PUT请求
    # 解析响应数据，

    #保活

        response3 = requests.put(url3, headers=headers3, data=json.dumps(data3))
        result3 = json.loads(response3.text)
        token_new = result3['data']['token']
        return token_new

    

    ## 第一次鉴权

    #1 构造请求头
    def new_rtsp_api(self, token_new, deviceID, channelId):
        url = f"http://{self.DSS_IP}/admin/API/MTS/Video/StartVideo"
        headers = {
        'Host': f'{self.DSS_IP}',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        #二次鉴权获取的token，手动写入
        'X-Subject-Token': token_new
    }
    #2 第一次构造请求体
        data = {
        "clientType": "WINPC_V2",
        "clientMac": "18-5E-0F-C4-AF-22",
        #"clientMac": "18:56:80:83:72:96",
        "clientPushId": "",
        "project": "PSDK",
        "method": "MTS.Video.StartVideo",
        "data": {
            "streamType": self.stream_type,
            "optional": "/admin/API/MTS/Video/StartVideo",
            "trackId": "",
            "extend": "",
            "channelId": f"{deviceID}$1$0${channelId}",
            "keyCode": "",
            "planId": "",
            "dataType": "2",
            "enableRtsps": "0"
        }
    }

    #3 发送POST请求
        response = requests.post(url, headers=headers, data=json.dumps(data))
    # 解析响应数据

        result1 = json.loads(response.text)
        return result1

    
    def get_rtsp(self, deviceID, channelId ):
        """Wraper fun this will get the RTSP based on DeviceID and ChannelID

        Args:
            deviceID (int): DeviceID of DSS
            channelId (int): Channel number of that device, ChannelID should be in form of 1 to n 
        """
        api_channelId = channelId 
        url, headers, result1 = self.header1()
        result2 = self.header2(url, headers, result1)
        token_new = self.header3(result2)
        result1 = self.new_rtsp_api(token_new, deviceID, api_channelId)
        try:
            rtsp =  str(result1['data']['url']).split('|')[-1] +"?token="+ result1['data']['token']
        except:
            rtsp = ""
        return rtsp