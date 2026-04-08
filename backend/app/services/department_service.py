from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.department import DepartmentModel
from app.schemas.department_schema import DepartmentSchema

def create_department(dept_data: DepartmentSchema, db: Session):

    dept_name=dept_data.name.strip()
    dept_code=dept_data.code.strip()
    existing = db.query(DepartmentModel).filter(DepartmentModel.name.ilike(dept_name)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department already exists")

    new_dept = DepartmentModel(
        name=dept_name,
        code=dept_code
    )
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    return new_dept

def get_departments(db: Session):
    return db.query(DepartmentModel).all()