from fastapi import FastAPI
from app.database.connection import Base, engine

from app.models.patient import PatientModel

from app.routes.patient_routes import patient_router

Base.metadata.create_all(bind=engine)

app=FastAPI(title="This is my hospital queue management application")

app.include_router(patient_router)
