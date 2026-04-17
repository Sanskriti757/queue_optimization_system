from app.database.connection import Base, SessionLocal, engine
from app.models.user import UserModel, UserRole
from pwdlib import PasswordHash


password_hash = PasswordHash.recommended()

def get_password_hash(password):
    return password_hash.hash(password)

Base.metadata.create_all(bind=engine)

def create_admin():
    db = SessionLocal()

    try:
        name = input("Enter admin name: ")
        email = input("Enter admin email: ").lower().strip()
        password = input("Enter admin password: ")

        existing_user = db.query(UserModel).filter(UserModel.email == email).first()
        if existing_user:
            print("❌ Admin already exists with this email")
            return
        
        hashed_password = get_password_hash(password)

        new_admin = UserModel(
            name=name,
            email=email,
            password=hashed_password,
            role=UserRole.ADMIN,
        )

        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)

        print(f"\n✅ Admin created successfully!")

    finally:
        db.close()  

if __name__ == "__main__":
    create_admin()