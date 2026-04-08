# yaha or hamara main code logic hoga jisme ham patient ko register karenge database me

from app.models.patient import PatientModel
from app.database.connection import get_db
from app.schemas.patient_schema import PatientSchema
from sqlalchemy.orm import Session
# Logic to save patient data to the database
def register_patient(patient_data:PatientSchema, db: Session):
        
    data=patient_data.model_dump()  # Convert Pydantic model to dictionary
    new_patient = PatientModel(
        name=data["name"],
        age=data["age"],
        gender=data["gender"],
        contact_number=data["contact_number"],
        address=data["address"]
    )
    db.add(new_patient)
    db.commit()#save  krta h ye 
    db.refresh(new_patient)
    # For now, we will just return the received data as a confirmation
    return {"message": "Patient registered successfully", "patient_data": patient_data}

def show_patients(db: Session):
    patients = db.query(PatientModel).all()
    return patients