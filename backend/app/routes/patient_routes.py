from fastapi import APIRouter, Depends,status
from app.services.patient_service import register_patient,show_patients
from app.schemas.patient_schema import PatientSchema
from app.database.connection import get_db
<<<<<<< HEAD
=======
from app.dependencies.auth import require_triage
>>>>>>> 3f35fff99f8bbe6cd1e6fc8a30ddae04af7f000e

patient_router = APIRouter(prefix="/patients")


@patient_router.post("/register",status_code=status.HTTP_201_CREATED)
<<<<<<< HEAD
def register_patient_endpoint(patient_data:PatientSchema, db=Depends(get_db)):
=======
def register_patient_endpoint(patient_data:PatientSchema,triage_user=Depends(require_triage), db=Depends(get_db)):
>>>>>>> 3f35fff99f8bbe6cd1e6fc8a30ddae04af7f000e
    
    return register_patient(patient_data, db)
    
@patient_router.get("/all",status_code=status.HTTP_200_OK)
def show_patients_endpoint(db=Depends(get_db)):
    return show_patients(db)
<<<<<<< HEAD
=======

>>>>>>> 3f35fff99f8bbe6cd1e6fc8a30ddae04af7f000e
