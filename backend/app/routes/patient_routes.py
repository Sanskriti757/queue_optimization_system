from fastapi import APIRouter, Depends,status
from app.services.patient_service import register_patient,show_patients
from app.schemas.patient_schema import PatientSchema
from app.database.connection import get_db
from app.dependencies.auth import require_triage

patient_router = APIRouter(prefix="/patients")


@patient_router.post("/register",status_code=status.HTTP_201_CREATED)
def register_patient_endpoint(patient_data:PatientSchema,triage_user=Depends(require_triage), db=Depends(get_db)):
    
    return register_patient(patient_data, db)
    
@patient_router.get("/all",status_code=status.HTTP_200_OK)
def show_patients_endpoint(db=Depends(get_db)):
    return show_patients(db)

