from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from mongoengine import DoesNotExist
from models.profile_schema import Profile
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login_user(data: LoginRequest):
    try:
        user = Profile.objects.get(username=data.username)
        if not pwd_context.verify(data.password, user.password):
            raise HTTPException(status_code=400, detail="Invalid username or password")

        return {"message": "Login successful", "userId": str(user.id)}
    except DoesNotExist:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
