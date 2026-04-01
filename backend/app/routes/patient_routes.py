from fastapi import APIRouter
from app.services.patient_service import register_patient
from app.schemas.patient_schema import PatientSchema

patient_router = APIRouter(prefix="/patients")


@patient_router.post("/register")
def register_patient_endpoint(patient_data:PatientSchema):
    
    return register_patient(patient_data)
