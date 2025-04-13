from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from mongoengine import DoesNotExist
from models.profile_schema import Profile
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
async def register_user(data: RegisterRequest):
    try:
        if Profile.objects(username=data.username):
            raise HTTPException(status_code=400, detail="Username already exists")

        hashed_password = pwd_context.hash(data.password)

        new_user = Profile(username=data.username, password=hashed_password)
        new_user.save()

        return {"message": "User registered successfully", "userId": str(new_user.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
