from datetime import datetime, timezone


def body_temp_score(temp: float) -> int:
    if 97.0 <= temp <= 100.4:
        return 0
    if 95.2 <= temp < 97.0 or 100.4 < temp <= 102.2:
        return 1
    if temp < 95.2 or 102.2 < temp <= 104.0:
        return 2
    return 3


def spo2_score(spo2: int) -> int:
    if spo2 >= 95:
        return 0
    if 92 <= spo2 <= 94:
        return 1
    if 88 <= spo2 <= 91:
        return 2
    return 3


def bp_score(sbp: int) -> int:
    if 110 <= sbp <= 219:
        return 0
    if 100 <= sbp <= 109 or 220 <= sbp <= 229:
        return 1
    if 90 <= sbp <= 99 or 230 <= sbp <= 249:
        return 2
    return 3


def hr_score(hr: int) -> int:
    if 51 <= hr <= 110:
        return 0
    if 41 <= hr <= 50 or 111 <= hr <= 130:
        return 1
    if 31 <= hr <= 40 or 131 <= hr <= 150:
        return 2
    return 3


def parse_systolic_bp(bp_value: str | None) -> int | None:
    if not bp_value:
        return None
    bp_text = str(bp_value).strip()
    if "/" in bp_text:
        systolic_text = bp_text.split("/")[0].strip()
        if systolic_text.isdigit():
            return int(systolic_text)
    return None


def calculate_priority(
    *,
    age: int,
    physical_disability: bool,
    body_temperature: float | None,
    oxygen_lvl: int | None,
    heart_rate: int | None,
    blood_pressure: str | None,
) -> int:
    score = 0

    if body_temperature is not None:
        score += body_temp_score(body_temperature)

    if oxygen_lvl is not None:
        score += spo2_score(oxygen_lvl)

    if heart_rate is not None:
        score += hr_score(heart_rate)

    systolic_bp = parse_systolic_bp(blood_pressure)
    if systolic_bp is not None:
        score += bp_score(systolic_bp)

    if physical_disability:
        score += 2

    if age >= 65 or age <= 7:
        score += 3

    return score


def queue_priority_boost(created_at: datetime | None) -> int:
    if not created_at:
        return 0

    now = datetime.now(timezone.utc)
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)

    elapsed_minutes = int((now - created_at).total_seconds() // 60)
    return max(0, elapsed_minutes // 10)
