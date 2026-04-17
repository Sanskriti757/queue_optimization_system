from datetime import datetime

from fastapi import APIRouter, Depends, status,Request, Response
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.services.user_service import login_user,create_user,logout_user
from app.models.user import UserModel
from app.models.patient import PatientModel
from app.models.department import DepartmentModel
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

@user_routes.get("/doctors",status_code=status.HTTP_200_OK)
def get_all_doctors_endpoint(db: Session = Depends(get_db)):
    doctors = (
        db.query(UserModel, DepartmentModel.name.label("department_name"))
        .outerjoin(DepartmentModel, UserModel.department_id == DepartmentModel.department_id)
        .filter(UserModel.role == "DOCTOR")
        .all()
    )
    return [
        {
            "user_id": doctor.user_id,
            "name": doctor.name,
            "email": doctor.email,
            "role": doctor.role.value if hasattr(doctor.role, "value") else doctor.role,
            "department_id": doctor.department_id,
            "department_name": department_name,
        }
        for doctor, department_name in doctors
    ]


@user_routes.get("/triage-nurses",status_code=status.HTTP_200_OK)
def get_all_triage_nurses_endpoint(db: Session = Depends(get_db)):
    triage_nurses = db.query(UserModel).filter(UserModel.role == "TRIAGE").all()
    return triage_nurses


@user_routes.get("/admin-analytics", status_code=status.HTTP_200_OK)
def get_admin_analytics_endpoint(admin_user: UserModel = Depends(require_admin), db: Session = Depends(get_db)):
    def normalize_datetime(value):
        if not value:
            return None
        if isinstance(value, str):
            try:
                value = datetime.fromisoformat(value)
            except ValueError:
                return None
        if value.tzinfo is not None:
            return value.replace(tzinfo=None)
        return value

    users = db.query(UserModel).all()
    patients = db.query(PatientModel).all()
    active_patients = [patient for patient in patients if patient.status in {"WAITING", "IN_TREATMENT"}]
    now = datetime.now()
    today = now.date()

    today_labels = [f"{hour:02d}:00" for hour in range(0, now.hour + 1)]
    today_data = [0] * len(today_labels)
    week_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    week_data = [0] * len(week_labels)
    department_counts = {}
    treated_today = 0
    patients_registered_today = 0
    wait_times = []

    for patient in patients:
        created_at = normalize_datetime(patient.created_at)
        if not created_at:
            continue

        if created_at.date() == today:
            patients_registered_today += 1
            if patient.status == "COMPLETED":
                treated_today += 1
            if 0 <= created_at.hour <= now.hour:
                today_data[created_at.hour] += 1

        if 0 <= (today - created_at.date()).days < 7:
            day_index = created_at.weekday()
            if 0 <= day_index <= 6:
                week_data[day_index] += 1

    for patient in active_patients:
        department_key = str(patient.department_id or "Unassigned")
        department_counts[department_key] = department_counts.get(department_key, 0) + 1
        created_at = normalize_datetime(patient.created_at)
        if created_at:
            wait_times.append(max(int((now - created_at).total_seconds() // 60), 0))

    if department_counts:
        department_ids = [int(dept_id) for dept_id in department_counts.keys() if str(dept_id).isdigit()]
        departments = db.query(DepartmentModel).filter(DepartmentModel.department_id.in_(department_ids)).all()
        department_map = {str(department.department_id): department.name for department in departments}
        department_labels = [department_map.get(dept_id, f"Dept {dept_id}") for dept_id in department_counts.keys()]
        department_data = list(department_counts.values())
    else:
        department_labels = ["No Queue"]
        department_data = [1]

    doctors_total = sum(
        1
        for user in users
        if (user.role.value if hasattr(user.role, "value") else str(user.role)) == "DOCTOR"
    )
    triage_total = sum(
        1
        for user in users
        if (user.role.value if hasattr(user.role, "value") else str(user.role)) == "TRIAGE"
    )
    doctors_on_duty = len({patient.assigned_doctor_id for patient in active_patients if patient.assigned_doctor_id})
    avg_wait_minutes = round(sum(wait_times) / len(wait_times)) if wait_times else 0
    occupancy_percent = min(round((len(active_patients) / 50) * 100), 100)

    return {
        "summary": {
            "total_users": len(users),
            "total_patients": len(patients),
            "active_queue": len(active_patients),
            "doctors_total": doctors_total,
            "triage_total": triage_total,
            "doctors_on_duty": doctors_on_duty,
            "patients_treated_today": treated_today,
            "patients_registered_today": patients_registered_today,
            "avg_wait_minutes": avg_wait_minutes,
            "occupancy_percent": occupancy_percent,
        },
        "patient_flow": {
            "today": {"labels": today_labels, "data": today_data},
            "week": {"labels": week_labels, "data": week_data},
        },
        "department_queue": {
            "labels": department_labels,
            "data": department_data,
        },
    }
