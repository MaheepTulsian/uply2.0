from fastapi import APIRouter, HTTPException, Body, status
from pydantic import BaseModel, EmailStr
from controllers.auth import login_with_email

router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login", status_code=status.HTTP_200_OK)
async def login_user(data: LoginRequest):
    """
    Authenticate a user with email and password
    """
    try:
        result = login_with_email(data.email, data.password)
        
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