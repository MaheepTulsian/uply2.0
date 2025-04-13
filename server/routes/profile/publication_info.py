from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from models.profile_schema import Profile, Publication

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

@router.post("/{user_id}/publication_info", status_code=status.HTTP_200_OK)
async def update_publications(
    user_id: str,
    publications: list[dict] = Body(..., embed=True)
):
    try:
        # Validate input array
        if not isinstance(publications, list) or len(publications) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Publications must be a non-empty array."
            )

        # Validate each publication
        for pub in publications:
            # Required fields check
            required_fields = ["title", "publisher", "publicationDate"]
            if any(pub.get(field) is None for field in required_fields):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Title, publisher, and publication date are required for each publication."
                )

            # Date validation
            try:
                pub_date = datetime.strptime(pub["publicationDate"], "%Y-%m-%d")
                if pub_date > datetime.now():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Publication date cannot be in the future."
                    )
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid date format: {str(e)}"
                )

        # Convert to Publication embedded documents
        publication_entries = [
            Publication(
                title=entry["title"],
                publisher=entry["publisher"],
                publicationDate=datetime.strptime(entry["publicationDate"], "%Y-%m-%d"),
                description=entry.get("description"),
                link=entry.get("link")
            )
            for entry in publications
        ]

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        profile.publications = publication_entries
        profile.save()

        # Serialize response
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Publications updated successfully.",
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