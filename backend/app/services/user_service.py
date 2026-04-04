from fastapi import HTTPException,status,Request
from app.schemas.user_schema import LoginSchema
from sqlalchemy.orm import Session
from app.models.user import UserModel

from datetime import datetime, timedelta
from app.config import settings
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError



password_hash = PasswordHash.recommended()


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)

# Logic to authenticate user and return a token or session
def login_user(user_data: LoginSchema, db: Session):
    
    user=db.query(UserModel).filter(UserModel.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    if not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")
    
    exp_time = datetime.now() + timedelta(minutes=settings.EXP_TIME)
        
    token=jwt.encode({"_id": user.user_id,"exp": exp_time.timestamp()}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return {"token": token}

def is_authenticated(request:Request,db: Session):
    try:
        token = request.headers.get("Authorization")
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="you are not authorized")
        
        token = token.split(" ")[1]
        data=jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id=data.get("_id")
        
        user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        return user
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="you are not authorized")