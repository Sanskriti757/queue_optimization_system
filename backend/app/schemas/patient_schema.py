from pydantic import BaseModel, Field
from typing import Optional

# pydantic kya hota ha: Pydantic ek library hai jo data ko check (validate) aur convert karti hai

# ye ek patient schema hai jisme patient ki details validate hongi jab wo register hoga 
class PatientSchema(BaseModel):
    name: str
    age: int
    gender: str
    contact_number: str = Field(pattern=r'^\+?\d{10,15}$')  # Validates phone numbers with optional '+' and 10-15 digits
    address: Optional[str] = None  # Optional field
