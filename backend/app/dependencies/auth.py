from fastapi import Depends, HTTPException, Request, status
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

import jwt

from app.config import settings
from app.database.connection import get_db
from app.models.user import UserModel, UserRole


def is_authenticated(request: Request, db: Session = Depends(get_db)):
    try:
        token = request.cookies.get("access_token")

        if not token:
            auth_headers = request.headers.get("Authorization")
            if auth_headers and auth_headers.startswith("Bearer "):
                token = auth_headers.split(" ")[1]

        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="you are not authorized")

        data = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = data.get("_id")

        user = db.query(UserModel).filter(UserModel.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        return user
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="you are not authorized")


def require_admin(user: UserModel = Depends(is_authenticated)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

    return user
