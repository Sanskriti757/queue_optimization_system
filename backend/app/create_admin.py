from app.database.connection import Base, SessionLocal, engine
from app.models.user import User, User_Role
from pwdlib import PasswordHash
pwd_context = PasswordHash.recommended()

Base.metadata.create_all(bind=engine)

def create_admin():
    db = SessionLocal()

    try:
        name = input("Enter admin name: ")
        email = input("Enter admin email: ")
        password = input("Enter admin password: ")

        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print("❌ Admin already exists with this email")
            return
        
        hashed_password = pwd_context.hash(password)

        admin = User(
            name=name,
            email=email,
            password=hashed_password,
            role=User_Role.ADMIN,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print(f"\n✅ Admin created successfully!")

    finally:
        db.close()  

if __name__ == "__main__":
    create_admin()
