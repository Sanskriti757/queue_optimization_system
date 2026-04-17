from pydantic import BaseModel, Field
from typing import Optional

class PatientSchema(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    age: int = Field(..., gt=0, lt=120)
    gender: str = Field(..., pattern="^(male|female|other)$")
    contact_number: str = Field(
        ..., 
        pattern=r'^\+?\d{10,15}$'
    )
    address: Optional[str] = None
    physical_disability: bool = False
    symptoms: Optional[str] = None
    body_temperature: Optional[float] = Field(default=None, ge=30, le=110) # in Fahrenheit
    blood_pressure: Optional[str] = Field(default=None, max_length=20)
    heart_rate: Optional[int] = Field(default=None, gt=0, lt=300)
    oxygen_lvl: Optional[int] = Field(default=None, ge=0, le=100)
    department_id: int = Field(..., gt=0)


class ConsultationUpdateSchema(BaseModel):
    diagnosis: Optional[str] = Field(default=None, max_length=2000)
    prescribed_medicines: Optional[str] = Field(default=None, max_length=4000)
    referral_notes: Optional[str] = Field(default=None, max_length=2000)
