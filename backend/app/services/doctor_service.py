from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.patient import PatientModel
from app.schemas.patient_schema import ConsultationUpdateSchema
from app.services.patient_service import refresh_waiting_priorities

def get_doctor_queue(db:Session, doctor_id: int):
    refresh_waiting_priorities(db, doctor_id)

    patients = db.query(PatientModel).filter(
        PatientModel.assigned_doctor_id == doctor_id,
        PatientModel.status.in_(["WAITING", "IN_TREATMENT"]),
    ).all()

    patients.sort(
        key=lambda p: p.priority_score or 0,
        reverse=True
    )
    return patients

def start_treatment(patient_id: int, doctor_id: int, db: Session):
    patient = db.query(PatientModel).filter(PatientModel.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    if patient.assigned_doctor_id != doctor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only call your assigned patients")
    if patient.status != "WAITING":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Patient is not in waiting queue")

    active_treatment = db.query(PatientModel).filter(
        PatientModel.assigned_doctor_id == doctor_id,
        PatientModel.status == "IN_TREATMENT",
        PatientModel.patient_id != patient_id,
    ).first()
    if active_treatment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Complete current patient treatment before calling another patient",
        )

    patient.status = "IN_TREATMENT"
    db.commit()
    db.refresh(patient)
    return patient

def complete_treatment(
    patient_id: int,
    doctor_id: int,
    db: Session,
    consultation_data: ConsultationUpdateSchema | None = None,
):
    patient = db.query(PatientModel).filter(PatientModel.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    if patient.assigned_doctor_id != doctor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only complete your assigned patients")
    if patient.status != "IN_TREATMENT":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Patient is not in treatment")

    if consultation_data is not None:
        patient.diagnosis = consultation_data.diagnosis.strip() if consultation_data.diagnosis else None
        patient.prescribed_medicines = (
            consultation_data.prescribed_medicines.strip() if consultation_data.prescribed_medicines else None
        )
        patient.referral_notes = consultation_data.referral_notes.strip() if consultation_data.referral_notes else None

    patient.status = "COMPLETED"
    db.commit()
    db.refresh(patient)
    return patient


def requeue_treatment_patient(patient_id: int, doctor_id: int, db: Session):
    patient = db.query(PatientModel).filter(PatientModel.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    if patient.assigned_doctor_id != doctor_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update your assigned patients")
    if patient.status != "IN_TREATMENT":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Patient is not in treatment")

    patient.status = "WAITING"
    db.commit()
    db.refresh(patient)
    return patient
