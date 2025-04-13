from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from datetime import datetime
from models.profile_schema import Profile, WorkExperience

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

@router.post("/{user_id}/workex_info", status_code=status.HTTP_200_OK)
async def update_work_experience(
    user_id: str,
    work_experience: list[dict] = Body(..., embed=True)
):
    try:
        # Validate input array
        if not isinstance(work_experience, list) or len(work_experience) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Work experience must be a non-empty array of objects."
            )

        # Validate each entry
        for exp in work_experience:
            # Required fields check
            required_fields = ["company", "position", "startDate", "isCurrent"]
            if any(exp.get(field) is None for field in required_fields):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Company, position, start date, and isCurrent are required for each entry."
                )

            # Validate isCurrent type
            if not isinstance(exp["isCurrent"], bool):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="isCurrent must be a boolean value."
                )

            # Parse dates
            try:
                start_date = datetime.strptime(exp["startDate"], "%Y-%m-%d")
                end_date = None
                
                if exp.get("endDate"):
                    end_date = datetime.strptime(exp["endDate"], "%Y-%m-%d")
                    if not exp["isCurrent"] and start_date >= end_date:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="End date must be after start date when not currently employed."
                        )
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid date format: {str(e)}"
                )

        # Convert to WorkExperience documents
        experience_entries = [
            WorkExperience(
                company=entry["company"],
                position=entry["position"],
                startDate=datetime.strptime(entry["startDate"], "%Y-%m-%d"),
                endDate=datetime.strptime(entry["endDate"], "%Y-%m-%d") if entry.get("endDate") else None,
                description=entry.get("description"),
                isCurrent=entry["isCurrent"]
            )
            for entry in work_experience
        ]

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        profile.workEx = experience_entries
        profile.save()

        # Serialize response
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Work experience updated successfully.",
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