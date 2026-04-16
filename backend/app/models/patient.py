<<<<<<< HEAD
<<<<<<< HEAD
import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database.connection import Base
from sqlalchemy.orm import relationship

# ye ek patient model hai jisme patient ki details store hongi database me
class PatientModel(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
=======
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
=======
import datetime
>>>>>>> 6a8f07514122fe700e1684947e6dc9254a692ac0

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database.connection import Base
from sqlalchemy.orm import relationship

# ye ek patient model hai jisme patient ki details store hongi database me
class PatientModel(Base):
    __tablename__ = "patients"

<<<<<<< HEAD
    patient_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
>>>>>>> 3f35fff99f8bbe6cd1e6fc8a30ddae04af7f000e
=======
    patient_id = Column(Integer, primary_key=True, index=True)
>>>>>>> 6a8f07514122fe700e1684947e6dc9254a692ac0

    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
<<<<<<< HEAD
<<<<<<< HEAD

    contact_number = Column(String, nullable=False)
    address = Column(String, nullable=True)

    disability = Column(Boolean, default=False)

    created_at = Column(DateTime)

    # 🔗 Relationship
    # queues = relationship("QueueModel", back_populates="patient")
=======
=======

>>>>>>> 6a8f07514122fe700e1684947e6dc9254a692ac0
    contact_number = Column(String, nullable=False)
    address = Column(String, nullable=True)

    disability = Column(Boolean, default=False)

    created_at = Column(DateTime)

<<<<<<< HEAD
    priority_score = Column(Integer, default=0)
    token_number = Column(Integer, nullable=True)
    status = Column(String, default="WAITING")

    assigned_doctor_id = Column(Integer, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    department = relationship("DepartmentModel")
>>>>>>> 3f35fff99f8bbe6cd1e6fc8a30ddae04af7f000e
=======
    # 🔗 Relationship
    # queues = relationship("QueueModel", back_populates="patient")
>>>>>>> 6a8f07514122fe700e1684947e6dc9254a692ac0
