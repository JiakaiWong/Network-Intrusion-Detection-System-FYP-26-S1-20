from pydantic import BaseModel, EmailStr

class UserIn(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str