from fastapi import HTTPException,status,Request, Response
from app.schemas.user_schema import LoginSchema, UserSchema
from sqlalchemy.orm import Session
from app.models.user import UserModel, UserRole

from datetime import datetime, timedelta
from app.config import settings
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError



password_hash = PasswordHash.recommended()

def get_password_hash(password):
    return password_hash.hash(password)


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

def create_user(user_data: UserSchema, db: Session):
    
    email = user_data.email.lower().strip()
    existing_user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    if user_data.role == UserRole.DOCTOR and not user_data.department_id:
        raise HTTPException(status_code=400, detail="Doctors must be assigned to a department")
    
    if user_data.role != UserRole.DOCTOR:
        user_data.department_id = None

    
    hashed_password = get_password_hash(user_data.password)
    
    new_user = UserModel(
        name=user_data.name,
        email=email,
        password=hashed_password,
        role=user_data.role,
        department_id=user_data.department_id
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


# Logic to authenticate user and return a token or session
def login_user(user_data: LoginSchema, db: Session, response: Response):
    
    email = user_data.email.lower().strip()
    user = db.query(UserModel).filter(UserModel.email == email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    exp_time = datetime.now() + timedelta(minutes=settings.EXP_TIME)
        
    token=jwt.encode({
        "_id": user.user_id,
        "role": user.role.value,
        "exp": exp_time
        }, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False, # Set to True in production with HTTPS
        samesite="lax"
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "user_id": user.user_id,
            "name": user.name,
            "role": user.role.value,
        }
    }

def logout_user(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out successfully"}