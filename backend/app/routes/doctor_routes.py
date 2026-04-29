from fastapi import APIRouter, Depends,status
from app.services.patient_service import register_patient, get_queue_with_wait_time
from app.services.doctor_service import complete_treatment, get_doctor_queue, requeue_treatment_patient, start_treatment
from app.schemas.patient_schema import ConsultationUpdateSchema, PatientSchema
from app.database.connection import get_db
from app.dependencies.auth import require_doctor

doctor_router = APIRouter(prefix="/doctors")


@doctor_router.get("/{doctor_id}/queue")
def get_doctor_queue_endpoint(doctor_id: int, db= Depends(get_db)):
    return get_doctor_queue(db, doctor_id)

@doctor_router.patch("/treatment/start/{patient_id}")
def start_treatment_endpoint(patient_id: int, doctor_user= Depends(require_doctor), db=Depends(get_db)):
    return start_treatment(patient_id, doctor_user.user_id, db)

@doctor_router.patch("/treatment/complete/{patient_id}")
def complete_treatment_endpoint(
    patient_id: int,
    consultation_data: ConsultationUpdateSchema | None = None,
    doctor_user= Depends(require_doctor),
    db=Depends(get_db),
):
    return complete_treatment(patient_id, doctor_user.user_id, db, consultation_data)


@doctor_router.patch("/treatment/requeue/{patient_id}")
def requeue_treatment_patient_endpoint(patient_id: int, doctor_user=Depends(require_doctor), db=Depends(get_db)):
    return requeue_treatment_patient(patient_id, doctor_user.user_id, db)
