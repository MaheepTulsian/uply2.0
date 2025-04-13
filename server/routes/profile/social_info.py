from fastapi import APIRouter, HTTPException, status, Body
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from models.profile_schema import Profile, Social
from pydantic import BaseModel, field_validator
import re

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

    @field_validator('*', mode='before')
    @classmethod
    def validate_urls(cls, value, field):
        url_regex = r"^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/[\w\d\-./?%&=]*)?$"
        if value and not re.fullmatch(url_regex, value):
            raise ValueError(f"Invalid URL format for {field.name}")
        return value

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

@router.post("/{user_id}/socials", status_code=status.HTTP_200_OK)
async def update_social_links(user_id: str, socials_update: SocialsUpdate = Body(...)):
    # Validate at least one social is provided
    if not any(socials_update.model_dump().values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one social link is required."
        )

    try:
        # Convert string ID to ObjectId
        obj_id = ObjectId(user_id)
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    # Create update dictionary, removing None values
    update_data = {f"socials.{k}": v for k, v in socials_update.model_dump().items() if v is not None}

    # Update profile using MongoEngine
    profile = Profile.objects(id=obj_id).modify(
        __raw__={"$set": update_data},
        new=True
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    # Convert MongoEngine document to serializable format
    profile_dict = mongo_to_dict(profile)

    return {
        "message": "Social links updated successfully.",
        "profile": profile_dict
    }