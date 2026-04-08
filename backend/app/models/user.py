from datetime import datetime
from enum import Enum

from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime, ForeignKey
from app.database.connection import Base
from app.models.department import DepartmentModel

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    DOCTOR = "DOCTOR"
    TRIAGE = "TRIAGE"


class UserModel(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    role = Column(SQLEnum(UserRole), nullable=False)

    department_id = Column(
        Integer,
        ForeignKey("departments.department_id"),
        nullable=True
    )

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)