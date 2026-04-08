from pydantic import BaseModel, EmailStr
from typing import Literal,Optional
from app.models.user import UserRole

class UserSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole
    department_id: Optional[int] = None


class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserResponseSchema(BaseModel):
    user_id: int
    name: str
    role: UserRole

class LoginResponseSchema(BaseModel):
    access_token: str
    token_type: str
    user: UserResponseSchema
