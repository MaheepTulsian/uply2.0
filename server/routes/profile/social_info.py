from fastapi import APIRouter, HTTPException, status, Body
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, model_validator
from controllers.profile.socials import update_social_links

router = APIRouter()

# Custom request model matching Social structure
class SocialsUpdate(BaseModel):
    linkedIn: str | None = None
    github: str | None = None
    twitter: str | None = None
    website: str | None = None
    medium: str | None = None
    stackOverflow: str | None = None
    leetcode: str | None = None

    @model_validator(mode='before')
    @classmethod
    def validate_at_least_one(cls, values):
        if not any(values.values()):
            raise ValueError("At least one social link is required")
        return values

@router.post("/{user_id}/socials", status_code=status.HTTP_200_OK)
async def update_social_links_route(user_id: str, socials_update: SocialsUpdate = Body(...)):
    try:
        # Convert Pydantic model to dictionary for the controller
        socials_dict = socials_update.model_dump()
        
        # Use the controller to handle business logic
        result = update_social_links(user_id, socials_dict)
        
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
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )