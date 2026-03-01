from fastapi import APIRouter, HTTPException
from services.user_service import create_user
from models.user import UserIn, UserOut

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