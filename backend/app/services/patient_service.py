from app.models.patient import PatientModel
from app.schemas.patient_schema import PatientSchema
from sqlalchemy.orm import Session

#Score body temperature in Fahrenheit. Inspired by NEWS2/MEWS ranges.
def body_temp_score(temp: float) -> int:
    if 97.0 <= temp <= 100.4:
        return 0
    if 95.2 <= temp < 97.0 or 100.4 < temp <= 102.2:
        return 1
    if temp < 95.2 or 102.2 < temp <= 104.0:
        return 2
    return 3  # Extreme deviations

# Score SpO2 level (%). Standard ranges from early warning scores."""
def spo2_score(spo2: int) -> int:
    if spo2 >= 95:
        return 0
    if 92 <= spo2 <= 94:
        return 1
    if 88 <= spo2 <= 91:
        return 2
    return 3

# Score systolic blood pressure (mmHg). Adapted from MEWS/NEWS2.
def bp_score(sbp: int) -> int:
    if 110 <= sbp <= 219:
        return 0
    if 100 <= sbp <= 109 or 220 <= sbp <= 229:
        return 1
    if 90 <= sbp <= 99 or 230 <= sbp <= 249:
        return 2
    return 3

# Score heart rate (bpm). Based on standard vital sign scoring.
def hr_score(hr: int) -> int:
    if 51 <= hr <= 110:
        return 0
    if 41 <= hr <= 50 or 111 <= hr <= 130:
        return 1
    if 31 <= hr <= 40 or 131 <= hr <= 150:
        return 2
    return 3

#Extract systolic BP from string like '120/80'.
def parse_systolic_bp(bp_value: str | None) -> int | None:
    if not bp_value:
        return None
    bp_text = str(bp_value).strip()
    if '/' in bp_text:
        systolic_text = bp_text.split("/")[0].strip()
        if systolic_text.isdigit():
            return int(systolic_text)
    return None

#Compute total priority score from vitals + adjustments.
def calculate_priority(patient: PatientModel) -> int:
    score = 0

    if patient.body_temperature is not None:
        score += body_temp_score(patient.body_temperature)

    if patient.oxygen_lvl is not None:
        score += spo2_score(patient.oxygen_lvl)

    if patient.heart_rate is not None:
        score += hr_score(patient.heart_rate)

    systolic_bp = parse_systolic_bp(patient.blood_pressure)
    if systolic_bp is not None:
        score += bp_score(systolic_bp)

    # Adjustments: +2 for physical disability (elevated risk), +3 for vulnerable ages [web:33][web:35]
    if patient.physical_disability:
        score += 2

    if patient.age >= 65 or patient.age <= 7:
        score += 3

    return score


def register_patient(patient_data: PatientSchema, db: Session):
    
    print(patient_data)

    # new_patient.priority_score = calculate_priority(new_patient)
    # new_patient.token_number = db.query(PatientModel).count() + 1

    # db.add(new_patient)
    # db.commit()
    # db.refresh(new_patient)
    # return new_patient
    pass


def show_patients(db: Session):
    patients = db.query(PatientModel).all()
    return patients