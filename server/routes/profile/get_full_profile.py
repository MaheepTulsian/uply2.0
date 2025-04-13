from fastapi import APIRouter, HTTPException
from models.profile_schema import Profile

router = APIRouter()

@router.get("/{user_id}/getprofile")
def get_full_profile(user_id: str):
    try:
        # Fetch profile by ID, excluding 'password' and 'username'
        print(f"Fetching profile for user ID: {user_id}")
        profile = Profile.objects(id=user_id).exclude("password", "username").first()

        if not profile:
            raise HTTPException(status_code=404, detail="User not found.")

        return profile.to_json()

    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error.")


@router.get("/profiles")
def get_all_profiles():
    profiles = Profile.objects.exclude("password", "username")  # Exclude sensitive fields
    return profiles.to_json()  # Convert to JSON format for response