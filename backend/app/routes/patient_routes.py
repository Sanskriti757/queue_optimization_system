from fastapi import APIRouter, Depends,status
from sqlalchemy.orm import Session
from app.services.patient_service import register_patient, get_queue_with_wait_time
from app.schemas.patient_schema import PatientSchema
from app.database.connection import get_db
from app.dependencies.auth import require_doctor_or_triage, require_triage, require_admin
from app.models.patient import PatientModel
from app.models.user import UserModel

patient_router = APIRouter(prefix="/patients")


@patient_router.post("/register",status_code=status.HTTP_201_CREATED)
def register_patient_endpoint(patient_data:PatientSchema,triage_user=Depends(require_triage), db=Depends(get_db)):
    
    patient= register_patient(patient_data, db)

    return {
        "message": "Patient registered successfully",
        "token_number": patient.token_number,
    }
    
@patient_router.get("/queue")
def get_queue_endpoint(user=Depends(require_doctor_or_triage), db=Depends(get_db)):
    
    return get_queue_with_wait_time(db)


@patient_router.get("/all", status_code=status.HTTP_200_OK)
def get_all_patients_endpoint(admin_user=Depends(require_admin), db: Session = Depends(get_db)):
    patients = (
        db.query(PatientModel, UserModel.name.label("assigned_doctor_name"))
        .outerjoin(UserModel, PatientModel.assigned_doctor_id == UserModel.user_id)
        .order_by(PatientModel.created_at.desc())
        .all()
    )

    return [
        {
            "patient_id": patient.patient_id,
            "token_number": patient.token_number,
            "name": patient.name,
            "age": patient.age,
            "gender": patient.gender,
            "department_id": patient.department_id,
            "status": patient.status,
            "priority_score": patient.priority_score,
            "diagnosis": patient.diagnosis,
            "prescribed_medicines": patient.prescribed_medicines,
            "referral_notes": patient.referral_notes,
            "assigned_doctor_id": patient.assigned_doctor_id,
            "assigned_doctor_name": assigned_doctor_name,
            "created_at": patient.created_at,
        }
        for patient, assigned_doctor_name in patients
    ]
