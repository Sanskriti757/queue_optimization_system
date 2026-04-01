from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database.connection import Base

# ye ek patient model hai jisme patient ki details store hongi database me
class PatientModel(Base):
    __tablename__="patients"

    patient_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String,nullable=False)
    age = Column(Integer, nullable=False)
    gender= Column(String, nullable=False)
    contact_number = Column(String, nullable=False,index=True,)
    address = Column(String, nullable=True)
