from fastapi import APIRouter, HTTPException, Body, status
from pydantic import BaseModel, EmailStr, validator
from controllers.auth import signup_with_email

router = APIRouter()

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    username: str
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
    
    @validator('username')
    def username_format(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        if not v.isalnum():
            raise ValueError('Username must contain only alphanumeric characters')
        return v


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup_user(data: SignupRequest):
    """
    Register a new user with email, password, and username
    """
    try:
        result = signup_with_email(data.email, data.password, data.username)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["errors"][0] if isinstance(result["errors"], list) else result["errors"]
            )
        
        return {
            "message": result["message"],
            "data": result.get("data", {})
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )