from fastapi import FastAPI
from app.database.connection import Base, engine

from app.models.patient import PatientModel
from app.models.queue import QueueModel
from app.models.department import DepartmentModel
from app.models.user import UserModel

from app.routes.patient_routes import patient_router
from app.routes.user_routes import user_routes

Base.metadata.create_all(bind=engine)

app=FastAPI(title="This is my hospital queue management application")

app.include_router(patient_router)
app.include_router(user_routes)
