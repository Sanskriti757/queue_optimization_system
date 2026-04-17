from app.models.patient import PatientModel
from app.models.department import DepartmentModel
from app.schemas.patient_schema import PatientSchema
from sqlalchemy.orm import Session

from app.models.user import UserModel, UserRole
from app.utils.patient_utils import calculate_priority, queue_priority_boost


def assign_doctors(department_id: int, db: Session):
    doctors = db.query(UserModel).filter(
        UserModel.department_id == department_id,
        UserModel.role == UserRole.DOCTOR,
    ).all()

    if not doctors:
        return None
    
    doctor_load = []

    for doctor in doctors:
        count = db.query(PatientModel).filter(
            PatientModel.assigned_doctor_id == doctor.user_id,
            PatientModel.status == "WAITING",
        ).count()
        doctor_load.append((doctor, count))

    doctor_load.sort(key=lambda item: item[1])
    return doctor_load[0][0].user_id


def generate_token_number(db: Session):
    last_patient=db.query(PatientModel).order_by(PatientModel.token_number.desc()).first()
    return (last_patient.token_number + 1) if last_patient and last_patient.token_number else 1


def register_patient(patient_data: PatientSchema, db: Session):
    new_patient = PatientModel(
        name=patient_data.name,
        age=patient_data.age,
        gender=patient_data.gender.lower(),
        contact_number=patient_data.contact_number,
        address=patient_data.address,
        physical_disability=patient_data.physical_disability,
        department_id=patient_data.department_id,
        symptoms=patient_data.symptoms,
        body_temperature=patient_data.body_temperature,
        blood_pressure=patient_data.blood_pressure,
        heart_rate=patient_data.heart_rate,
        oxygen_lvl=patient_data.oxygen_lvl,
    )
    new_patient.priority_score = calculate_priority(
        age=new_patient.age,
        physical_disability=new_patient.physical_disability,
        body_temperature=new_patient.body_temperature,
        oxygen_lvl=new_patient.oxygen_lvl,
        heart_rate=new_patient.heart_rate,
        blood_pressure=new_patient.blood_pressure,
    )
    new_patient.assigned_doctor_id = assign_doctors(new_patient.department_id, db)
    new_patient.token_number = generate_token_number(db)

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

def refresh_waiting_priorities(db: Session, doctor_id: int | None = None):
    patient_query = db.query(PatientModel).filter(PatientModel.status == "WAITING")
    if doctor_id is not None:
        patient_query = patient_query.filter(PatientModel.assigned_doctor_id == doctor_id)

    patients = patient_query.all()
    has_updates = False

    for record in patients:
        refreshed_priority = calculate_priority(
            age=record.age,
            physical_disability=record.physical_disability,
            body_temperature=record.body_temperature,
            oxygen_lvl=record.oxygen_lvl,
            heart_rate=record.heart_rate,
            blood_pressure=record.blood_pressure,
        ) + queue_priority_boost(record.created_at)
        if record.priority_score != refreshed_priority:
            record.priority_score = refreshed_priority
            has_updates = True

    if has_updates:
        db.commit()

    return has_updates

def get_queue(db:Session):
    refresh_waiting_priorities(db)

    patient=db.query(PatientModel).filter(
        PatientModel.status=="WAITING"
    ).all()

    patient.sort(
        key=lambda p: p.priority_score or 0,
        reverse=True
    )
    return patient

def get_queue_with_wait_time(db:Session):
    queue = get_queue(db)
    AVG_TIME = 10  # minutes per patient
    result = []
    department_ids = {patient.department_id for patient in queue if patient.department_id}
    doctor_ids = {patient.assigned_doctor_id for patient in queue if patient.assigned_doctor_id}
    department_map = {}
    doctor_map = {}

    if department_ids:
        departments = db.query(DepartmentModel).filter(DepartmentModel.department_id.in_(department_ids)).all()
        department_map = {department.department_id: department.name for department in departments}

    if doctor_ids:
        doctors = db.query(UserModel).filter(UserModel.user_id.in_(doctor_ids)).all()
        doctor_map = {doctor.user_id: doctor.name for doctor in doctors}

    queue_positions = {}

    for patient in queue:
        if patient.assigned_doctor_id:
            queue_key = f"doctor:{patient.assigned_doctor_id}"
        else:
            queue_key = f"department:{patient.department_id or 'unassigned'}"

        position_in_queue = queue_positions.get(queue_key, 0)
        estimated_wait = position_in_queue * AVG_TIME
        queue_positions[queue_key] = position_in_queue + 1

        result.append({
            "patient_id": patient.patient_id,
            "name": patient.name,
            "token": patient.token_number,
            "priority": patient.priority_score,
            "status": patient.status,
            "department_id": patient.department_id,
            "department_name": department_map.get(patient.department_id, "Unassigned"),
            "assigned_doctor_id": patient.assigned_doctor_id,
            "assigned_doctor_name": doctor_map.get(patient.assigned_doctor_id),
            "estimated_wait_time": estimated_wait,
            "queue_key": queue_key,
        })

    queue_wait_totals = {}
    queue_wait_counts = {}
    for item in result:
        key = item["queue_key"]
        queue_wait_totals[key] = queue_wait_totals.get(key, 0) + item["estimated_wait_time"]
        queue_wait_counts[key] = queue_wait_counts.get(key, 0) + 1

    for item in result:
        key = item["queue_key"]
        item["doctor_queue_avg_wait_time"] = round(queue_wait_totals[key] / queue_wait_counts[key]) if queue_wait_counts[key] else 0
        item.pop("queue_key", None)

    return result
