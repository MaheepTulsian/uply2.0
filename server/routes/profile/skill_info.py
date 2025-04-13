from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from models.profile_schema import Profile

router = APIRouter()

def mongo_to_dict(obj):
    """Custom serializer for MongoEngine documents"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: mongo_to_dict(v) for k, v in obj.items()}
    if hasattr(obj, '_data'):
        data = obj._data
        if 'id' not in data and hasattr(obj, 'id'):
            data['id'] = str(obj.id)
        return mongo_to_dict(data)
    if isinstance(obj, list):
        return [mongo_to_dict(v) for v in obj]
    return obj

@router.post("/{user_id}/skill_info", status_code=status.HTTP_200_OK)
async def update_skills(
    user_id: str,
    skills: list = Body(..., embed=True)
):
    try:
        # Validate input array
        if not isinstance(skills, list) or len(skills) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Skills must be a non-empty array of strings."
            )

        # Validate each skill is a non-empty string
        for skill in skills:
            if not isinstance(skill, str) or not skill.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Each skill must be a non-empty string."
                )

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # Replace existing skills
        profile.skills = skills
        profile.save()

        # Convert to serializable format
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Skills updated successfully.",
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