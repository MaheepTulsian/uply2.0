from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from models.profile_schema import Profile, Achievement

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

@router.post("/{user_id}/achievement_info", status_code=status.HTTP_200_OK)
async def update_achievements(
    user_id: str,
    achievements: list[dict] = Body(..., embed=True)
):
    try:
        # Validate input array
        if not isinstance(achievements, list) or len(achievements) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Achievements must be a non-empty array."
            )

        # Validate each achievement
        for achievement in achievements:
            # Required fields check
            if not all(key in achievement for key in ["title", "date"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Title and date are required for each achievement."
                )

            # Date validation
            try:
                achievement_date = datetime.strptime(achievement["date"], "%Y-%m-%d")
                if achievement_date > datetime.now():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Achievement date cannot be in the future."
                    )
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid date format: {str(e)}"
                )

        # Convert to Achievement embedded documents
        achievement_entries = [
            Achievement(
                title=entry["title"],
                date=datetime.strptime(entry["date"], "%Y-%m-%d"),
                description=entry.get("description"),
                issuer=entry.get("issuer")
            )
            for entry in achievements
        ]

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        profile.achievements = achievement_entries
        profile.save()

        # Serialize response
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Achievements updated successfully.",
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