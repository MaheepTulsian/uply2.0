from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from datetime import datetime
import re
from models.profile_schema import Profile, PersonalInfo, Address

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

@router.post("/{user_id}/personal_info", status_code=status.HTTP_200_OK)
async def update_profile(
    user_id: str,
    payload: dict = Body(...)
):
    try:
        # Extract fields from payload
        first_name = payload.get("firstName")
        last_name = payload.get("lastName")
        email = payload.get("email")
        phone = payload.get("phone")
        date_of_birth = payload.get("dateOfBirth")
        address_data = payload.get("address")
        resume = payload.get("resume")

        # Required field validation
        if not all([first_name, last_name, email, phone]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="First name, last name, email, and phone are required."
            )

        # Validate email format
        if not re.match(r'^\S+@\S+\.\S+$', email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid email format."
            )

        # Validate date of birth
        if date_of_birth:
            try:
                dob_date = datetime.strptime(date_of_birth, '%Y-%m-%d')
                if dob_date >= datetime.now():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Invalid date of birth. It must be in the past."
                    )
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid date format. Use YYYY-MM-DD."
                )

        # Check email uniqueness
        existing_user = Profile.objects(
            personalInfo__email=email,
            id__ne=ObjectId(user_id)
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already in use by another account."
            )

        # Prepare address object
        address = None
        if address_data:
            address = Address(
                street=address_data.get("street"),
                city=address_data.get("city"),
                state=address_data.get("state"),
                country=address_data.get("country"),
                zipCode=address_data.get("zipCode")
            )

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # Create/update personal info
        profile.personalInfo = PersonalInfo(
            firstName=first_name,
            lastName=last_name,
            email=email,
            phone=phone,
            dateOfBirth=dob_date if date_of_birth else None,
            address=address,
            resume=resume
        )

        profile.save()

        # Convert to serializable format
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Profile updated successfully.",
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