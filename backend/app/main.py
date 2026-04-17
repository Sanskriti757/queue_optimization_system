import asyncio
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from app.database.connection import Base, SessionLocal, engine

from app.models.patient import PatientModel
from app.models.department import DepartmentModel
from app.models.user import UserModel

from app.routes.patient_routes import patient_router
from app.routes.user_routes import user_routes
from app.routes.department_routes import department_routes
from app.routes.doctor_routes import doctor_router
from app.services.patient_service import refresh_waiting_priorities

Base.metadata.create_all(bind=engine)


def ensure_patient_consultation_columns():
    inspector = inspect(engine)
    existing_columns = {column["name"] for column in inspector.get_columns("patients")}
    required_columns = {
        "diagnosis": "VARCHAR",
        "prescribed_medicines": "VARCHAR",
        "referral_notes": "VARCHAR",
    }
    with engine.begin() as connection:
        for column_name, column_type in required_columns.items():
            if column_name not in existing_columns:
                connection.execute(text(f"ALTER TABLE patients ADD COLUMN {column_name} {column_type}"))


ensure_patient_consultation_columns()

AGING_REFRESH_INTERVAL_SECONDS = 60


async def _run_priority_aging():
    while True:
        db = SessionLocal()
        try:
            refresh_waiting_priorities(db)
        finally:
            db.close()
        await asyncio.sleep(AGING_REFRESH_INTERVAL_SECONDS)


@asynccontextmanager
async def lifespan(_: FastAPI):
    aging_task = asyncio.create_task(_run_priority_aging())
    try:
        yield
    finally:
        aging_task.cancel()
        with suppress(asyncio.CancelledError):
            await aging_task


app=FastAPI(title="This is my hospital queue management application", lifespan=lifespan)

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
app.include_router(doctor_router)
