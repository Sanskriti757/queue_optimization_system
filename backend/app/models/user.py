from datetime import datetime
from enum import Enum

from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime

from app.database.connection import Base


class User_Role(str,Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    TRIAGE= "triage"

class UserModel(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name= Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(SQLEnum(User_Role), nullable=False)

    department_id = Column(Integer, nullable=True)  # For doctors, this can be null for admins and triage nurses

    created_at = Column(DateTime, nullable=False,default=datetime.utcnow)