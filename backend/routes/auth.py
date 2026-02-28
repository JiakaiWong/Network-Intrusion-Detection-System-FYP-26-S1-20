from fastapi import APIRouter
from services.user_service import create_user
from models.user import UserIn, UserOut

router = APIRouter()

@router.post("/api/auth/register", response_model=UserOut)
async def register(user_data: UserIn): # FastAPI automatically parses JSON body
    try:
        user = await create_user(user_data.email, user_data.password, user_data.full_name)
        return user
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))