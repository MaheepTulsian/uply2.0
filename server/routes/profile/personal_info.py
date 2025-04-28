from fastapi import APIRouter, HTTPException, Body, status
from fastapi.encoders import jsonable_encoder
from controllers.profile.personal_info import update_personal_info

router = APIRouter()

@router.post("/{user_id}/personal_info", status_code=status.HTTP_200_OK)
async def update_profile(
    user_id: str,
    payload: dict = Body(...)
):
    try:
        # Use the controller to handle business logic
        result = update_personal_info(user_id, payload)
        
        if not result["success"]:
            status_code = result.get("status_code", status.HTTP_400_BAD_REQUEST)
            if status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found."
                )
            else:
                raise HTTPException(
                    status_code=status_code,
                    detail=result["errors"]
                )
        
        # The profile is already serialized in the controller using mongo_to_dict
        # but we still need to run it through jsonable_encoder for proper JSON serialization
        serialized_data = jsonable_encoder(result["data"])
        
        return {
            "message": result["message"],
            "profile": serialized_data["profile"]
        }
    
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )