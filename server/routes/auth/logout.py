from fastapi import APIRouter, HTTPException, Body, status
from pydantic import BaseModel
from controllers.auth import logout_user

router = APIRouter()

class LogoutRequest(BaseModel):
    idToken: str


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(data: LogoutRequest):
    """
    Logout a user by revoking their Firebase tokens
    """
    try:
        result = logout_user(data.idToken)
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result["errors"][0] if isinstance(result["errors"], list) else result["errors"]
            )
        
        return {
            "message": result["message"]
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )