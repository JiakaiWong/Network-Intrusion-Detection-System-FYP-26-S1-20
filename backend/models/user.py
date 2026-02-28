from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum

class RoleEnum(str, Enum):
    ANALYST = "analyst"
    ADMIN = "admin"
    VIEWER = "viewer"

class UserIn(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: RoleEnum

    @field_validator('email', 'full_name', 'password', mode='before')
    def trim_strings(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str