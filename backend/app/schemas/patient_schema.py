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
    
    department_id: int = Field(..., gt=0)
