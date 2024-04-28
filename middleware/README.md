# EDGEVANA CORE

Edgevana Core APIs

* Edgevana is a broad platform with multiple dependent/independent micro services catering different user/engineering/admin activities.
* With multiple services performing CRUD operations, issues of rate limiting/level access arise. 
* Edgevana Core solves the mentioned problem by providing a level layer access to users with different authorities.
* Edgevana Core manage APIs for all Edgevana micro-services. This also eliminates any need for micro services to independently call third party APIs to function.
The services now need to be in sync only with Edgevana Core API for their functioning.

## USER MANAGEMENT SYSTEM
![user_managmenet_core](static/readme/user-management.png)

![user_managmenet_core_er](static/readme/user-management-er.png)
<<<<<<< HEAD


## INSTALLATION
```
python3 -m venv env
pip install --upgrade pip
pip install -r requirements.txt
source env/bin/activate
uvicorn app:app --reload --port 8080
```
=======
>>>>>>> d764527016248aa5abfeb6080957b89331ce9acb

## CORE USER AND SERVICE WORKFLOW
![core_service](static/readme/core-service.png)