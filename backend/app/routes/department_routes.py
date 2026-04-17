from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.department_schema import DepartmentSchema, DepartmentResponseSchema
from app.services.department_service import create_department, get_departments
from app.models.user import UserModel
from app.dependencies.auth import require_admin

department_routes = APIRouter(prefix="/department")

# Admin creates department
@department_routes.post("/create", response_model=DepartmentResponseSchema, status_code=status.HTTP_201_CREATED)
def create_department_endpoint(dept_data: DepartmentSchema, user: UserModel = Depends(require_admin), db: Session = Depends(get_db)):
    return create_department(dept_data, db)

# List all departments (for dropdowns)
@department_routes.get("/all", response_model=list[DepartmentResponseSchema])
def list_departments(db: Session = Depends(get_db)):
    return get_departments(db)