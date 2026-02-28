from database import db
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user(email: str, password: str, full_name: str):
    # Check if user already exists
    existing = await db.users.find_one({"email": email})
    if existing:
        print(f"Existing user found: {existing}")
        raise ValueError("Email already registered")
    
    # Hash password
    hashed_password = pwd_context.hash(password)
    

    # Insert into database
    user_doc = {
        "email": email,
        "hashed_password": hashed_password,
        "full_name": full_name
    }
    result = await db.users.insert_one(user_doc)
    
    # Return the created user (with the new id)
    return {
        "id": str(result.inserted_id),
        "email": email,
        "full_name": full_name
    }