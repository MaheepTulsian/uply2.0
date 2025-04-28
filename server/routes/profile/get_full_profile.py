from fastapi import APIRouter, HTTPException, status
from models.profile_schema import Profile
from utils.profile_utils import mongo_to_dict
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.get("/{user_id}/getprofile", status_code=status.HTTP_200_OK)
async def get_full_profile(user_id: str):
    try:
        # Fetch profile by ID, excluding 'password' and 'username'
        profile = Profile.objects(id=user_id).exclude("password", "username").first()

        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="User not found."
            )

        # Convert to serializable format
        profile_dict = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_dict)

        return serialized_profile
        
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )


@router.get("/profiles", status_code=status.HTTP_200_OK)
async def get_all_profiles():
    try:
        # Fetch all profiles, excluding sensitive fields
        profiles = Profile.objects.exclude("password", "username")
        
        if not profiles:
            return []
            
        # Convert to serializable format
        profiles_list = [mongo_to_dict(profile) for profile in profiles]
        serialized_profiles = jsonable_encoder(profiles_list)
        
        return serialized_profiles
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )