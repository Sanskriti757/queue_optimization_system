from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import Base, engine

from app.models.patient import PatientModel
from app.models.queue import QueueModel
from app.models.department import DepartmentModel
from app.models.user import UserModel

from app.routes.patient_routes import patient_router
from app.routes.user_routes import user_routes
from app.routes.department_routes import department_routes

Base.metadata.create_all(bind=engine)

app=FastAPI(title="This is my hospital queue management application")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(patient_router)
app.include_router(user_routes)
app.include_router(department_routes)