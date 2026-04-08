# ye file database connection ke liye hai, jisme hum sqlalchemy ka use karenge database se connect hone ke liye. Humne yaha pe ek function banaya hai get_db() jo hume database session provide karega, jise hum apne API endpoints me use kar sakte hain.
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

Base = declarative_base()

engine = create_engine(settings.DB_CONNECTION)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()