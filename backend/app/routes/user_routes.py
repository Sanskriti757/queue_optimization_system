from fastapi import APIRouter, Depends, status,Request
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.user_service import login_user,is_authenticated
from app.schemas.user_schema import LoginSchema

user_routes = APIRouter(prefix="/user")


@user_routes.post("/login", status_code=status.HTTP_200_OK)
def login_user_endpoint(user_data: LoginSchema, db: Session = Depends(get_db)):
    return login_user(user_data, db)


@user_routes.get("/is_auth",status_code=status.HTTP_200_OK)
def is_auth(request:Request,db: Session = Depends(get_db)):
    return is_authenticated(request,db)