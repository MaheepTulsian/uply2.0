from fastapi import APIRouter, HTTPException, Body, status
from pydantic import BaseModel
from controllers.auth import google_auth_controller

router = APIRouter()

class GoogleAuthRequest(BaseModel):
    idToken: str


@router.post("/google", status_code=status.HTTP_200_OK)
async def google_auth(data: GoogleAuthRequest):
    """
    Authenticate a user with Google via Firebase
    """
    try:
        result = google_auth_controller(data.idToken)
        
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