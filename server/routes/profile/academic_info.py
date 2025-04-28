from fastapi import APIRouter, HTTPException, Body, status
from fastapi.encoders import jsonable_encoder
from controllers.profile.academic import update_academic_info

router = APIRouter()

@router.post("/{user_id}/academic_info", status_code=status.HTTP_200_OK)
async def update_academics(
    user_id: str,
    academics: list[dict] = Body(..., embed=True)
):
    try:
        # Use the controller to handle business logic
        result = update_academic_info(user_id, academics)
        
        if not result["success"]:
            if any("User not found" in error for error in result.get("errors", [])):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found."
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=result["errors"]
                )
        
        # Create response with serialized profile
        serialized_profile = jsonable_encoder(result["profile"])
        
        return {
            "message": result["message"],
            "profile": serialized_profile
        }
    
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )