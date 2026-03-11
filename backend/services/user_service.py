import re
from database import db
from core.security import hash_password

def validate_password_strength(password: str) -> None:
    # Validate password meets complexity requirements
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters long")
    
    if not re.search(r'[a-z]', password):
        raise ValueError("Password must contain at least one lowercase letter")
    
    if not re.search(r'[A-Z]', password):
        raise ValueError("Password must contain at least one uppercase letter")
    
    if not re.search(r'[0-9]', password):
        raise ValueError("Password must contain at least one digit")
    
    if not re.search(r'[!@#$%^&*()_\-+=\[\]{};:\'",.<>?/\\|`~]', password):
        raise ValueError("Password must contain at least one special character")

def validate_full_name(full_name: str) -> None:
    # Validate full name format
    if len(full_name) < 2:
        raise ValueError("Full name must be at least 2 characters long")
    
    if len(full_name) > 100:
        raise ValueError("Full name must not exceed 100 characters")
    
    if not re.match(r"^[a-zA-Z\s\-\']+$", full_name):
        raise ValueError("Full name can only contain letters, spaces, hyphens, and apostrophes")

async def get_user_by_email(email: str):
    email = email.strip()
    user = await db.users.find_one({"email": email})
    return user

async def create_user(email: str, password: str, full_name: str, role: str):
    email = email.strip()
    password = password.strip()
    full_name = full_name.strip()
    role = role.strip()
    
    # Check if user already exists
    existing = await db.users.find_one({"email": email})
    if existing:
        raise ValueError("Email already exists")
    
    # Validate password strength
    validate_password_strength(password)
    
    # Validate full name
    validate_full_name(full_name)
    
    # Hash password
    hashed_password = hash_password(password)
    
    # Insert into database
    user_doc = {
        "email": email,
        "hashed_password": hashed_password,
        "full_name": full_name,
        "role": role
    }
    result = await db.users.insert_one(user_doc)
    
    # Return the created user
    return {
        "id": str(result.inserted_id),
        "email": email,
        "full_name": full_name,
        "role": role
    }