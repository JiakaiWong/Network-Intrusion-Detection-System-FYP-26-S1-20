from fastapi import APIRouter, HTTPException, Depends
from services.user_service import (
    create_user, 
    get_user_by_email,
    get_all_users,
    get_user_by_id,
    update_user_profile,
    change_password
)
from services.auth_service import authenticate_user
from core.security import create_access_token, verify_token
from models.user import (
    UserIn, 
    UserOut, 
    LoginIn, 
    LoginOut,
    EditProfileIn,
    ChangePasswordIn,
    UserListOut
)
from typing import Optional
from bson import ObjectId

router = APIRouter()

def get_current_user(token: Optional[str] = None):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

def get_current_user_from_header(authorization: Optional[str] = None) -> dict:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@router.post("/api/auth/register", response_model=UserOut, status_code=201)
async def register(user_data: UserIn):
    try:
        user = await create_user(
            user_data.email, 
            user_data.password, 
            user_data.full_name,
            user_data.role
        )
        return user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/api/auth/login", response_model=LoginOut)
async def login(login_data: LoginIn):
    user = await authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create JWT token
    token_data = {"sub": user["email"], "role": user["role"], "user_id": str(user["_id"])}
    token = create_access_token(token_data)
    
    # Prepare user data for response
    user_out = UserOut(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        status=user.get("status", "pending")
    )
    
    return LoginOut(token=token, user=user_out)

@router.get("/api/users", response_model=list[UserListOut])
async def get_users(authorization: Optional[str] = None):
    current_user = get_current_user_from_header(authorization)
    
    if current_user.get("role") != "Administrator":
        raise HTTPException(status_code=403, detail="Only administrators can view all users")
    
    users = await get_all_users()
    return users

@router.get("/api/users/profile", response_model=UserOut)
async def get_profile(authorization: Optional[str] = None):
    current_user = get_current_user_from_header(authorization)
    
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserOut(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        status=user.get("status", "pending")
    )

@router.put("/api/users/profile", response_model=UserOut)
async def edit_profile(profile_data: EditProfileIn, authorization: Optional[str] = None):
    current_user = get_current_user_from_header(authorization)
    
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        user = await update_user_profile(user_id, profile_data.full_name)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserOut(
            id=str(user["_id"]),
            email=user["email"],
            full_name=user["full_name"],
            role=user["role"],
            status=user.get("status", "pending")
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/api/users/change-password")
async def change_user_password(password_data: ChangePasswordIn, authorization: Optional[str] = None):
    current_user = get_current_user_from_header(authorization)
    
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        user = await change_password(user_id, password_data.current_password, password_data.new_password)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"ok": True, "message": "Password changed successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))