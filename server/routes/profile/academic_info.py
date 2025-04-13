from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from datetime import datetime
import re
from models.profile_schema import Profile, Academic

router = APIRouter()

# Add the missing serializer function
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

@router.post("/{user_id}/academic_info", status_code=status.HTTP_200_OK)
async def update_academics(
    user_id: str,
    academics: list[dict] = Body(..., embed=True)
):
    try:
        # Validate input array
        if not isinstance(academics, list) or len(academics) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Academics data must be a non-empty array."
            )

        # Validate each academic entry
        for academic in academics:
            # Required fields check
            required_fields = ["institution", "degree", "fieldOfStudy", "startDate"]
            if any(academic.get(field) is None for field in required_fields):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Institution, degree, field of study, and start date are required for each entry."
                )

            # Date validation
            start_date = datetime.strptime(academic["startDate"], "%Y-%m-%d")
            end_date = None
            
            if academic.get("endDate"):
                end_date = datetime.strptime(academic["endDate"], "%Y-%m-%d")
                if start_date >= end_date:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"End date must be after start date for {academic['institution']}."
                    )

            # Grade format validation
            if academic.get("grade") and not re.match(r'^[A-Fa-f0-9.]+$', academic["grade"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid grade format for {academic['institution']}."
                )

        # Convert to Academic embedded documents
        academic_entries = [
            Academic(
                institution=entry["institution"],
                degree=entry["degree"],
                fieldOfStudy=entry["fieldOfStudy"],
                startDate=datetime.strptime(entry["startDate"], "%Y-%m-%d"),
                endDate=datetime.strptime(entry["endDate"], "%Y-%m-%d") if entry.get("endDate") else None,
                description=entry.get("description"),
                grade=entry.get("grade")
            )
            for entry in academics
        ]

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # Replace existing academic entries
        profile.academic = academic_entries
        profile.save()

        # Convert to serializable format using the helper function
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Academic records updated successfully.",
            "profile": serialized_profile
        }

    except HTTPException as he:
        raise he
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid date format: {str(e)}"
        )
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )