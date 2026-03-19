from pydantic import BaseModel, EmailStr, field_validator
from enum import Enum

class RoleEnum(str, Enum):
    ANALYST = "Security Analyst"
    ADMIN = "Administrator"

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
    status: str

class EditProfileIn(BaseModel):
    full_name: str
    
    @field_validator('full_name', mode='before')
    def trim_strings(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str
    
    @field_validator('current_password', 'new_password', mode='before')
    def trim_strings(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

class LoginIn(BaseModel):
    email: EmailStr
    password: str

    @field_validator('email', 'password', mode='before')
    def trim_strings(cls, v):
        if isinstance(v, str):
            return v.strip()
        return v

class LoginOut(BaseModel):
    token: str
    user: UserOut

class UserListOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: str
    status: str