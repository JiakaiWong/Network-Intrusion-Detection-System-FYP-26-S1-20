from fastapi import APIRouter, HTTPException
from services.user_service import create_user
from services.auth_service import authenticate_user
from core.security import create_access_token
from models.user import UserIn, UserOut, LoginIn, LoginOut

router = APIRouter()

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
    token_data = {"sub": user["email"], "role": user["role"]}
    token = create_access_token(token_data)
    
    # Prepare user data for response
    user_out = UserOut(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"]
    )
    
    return LoginOut(token=token, user=user_out)