from fastapi import APIRouter, Depends, status,Request, Response
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.user_service import login_user,create_user,logout_user
from app.models.user import UserModel
from app.schemas.user_schema import LoginSchema,UserSchema,UserResponseSchema,LoginResponseSchema
from app.dependencies.auth import is_authenticated, require_admin
user_routes = APIRouter(prefix="/user")


@user_routes.post("/create",response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(user_data: UserSchema, admin_user: UserModel = Depends(require_admin), db: Session = Depends(get_db)):
    return create_user(user_data, db)

@user_routes.post("/login",response_model=LoginResponseSchema, status_code=status.HTTP_200_OK)
def login_user_endpoint(response: Response, user_data: LoginSchema, db: Session = Depends(get_db)):
    return login_user(user_data, db, response)

@user_routes.post("/logout", status_code=status.HTTP_200_OK)
def logout_user_endpoint(response: Response):
    return logout_user(response)

@user_routes.get("/me",status_code=status.HTTP_200_OK)
def get_current_user(user_data: UserModel = Depends(is_authenticated)):
    return user_data
