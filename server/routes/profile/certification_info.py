from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from models.profile_schema import Profile, Certification

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

@router.post("/{user_id}/certification_info", status_code=status.HTTP_200_OK)
async def update_certifications(
    user_id: str,
    certifications: list[dict] = Body(..., embed=True)
):
    try:
        # Validate input array
        if not isinstance(certifications, list) or len(certifications) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Certifications must be a non-empty array."
            )

        # Validate each certification
        for cert in certifications:
            # Required fields check
            required_fields = ["name", "issuingOrganization", "issueDate"]
            if any(cert.get(field) is None for field in required_fields):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Name, issuing organization, and issue date are required for each certification."
                )

            # Date validation
            try:
                issue_date = datetime.strptime(cert["issueDate"], "%Y-%m-%d")
                expiration_date = None
                
                if cert.get("expirationDate"):
                    expiration_date = datetime.strptime(cert["expirationDate"], "%Y-%m-%d")
                    if expiration_date <= issue_date:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Expiration date must be after issue date."
                        )
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid date format: {str(e)}"
                )

        # Convert to Certification embedded documents
        cert_entries = [
            Certification(
                name=entry["name"],
                issuingOrganization=entry["issuingOrganization"],
                issueDate=datetime.strptime(entry["issueDate"], "%Y-%m-%d"),
                expirationDate=datetime.strptime(entry["expirationDate"], "%Y-%m-%d") if entry.get("expirationDate") else None,
                credentialId=entry.get("credentialId"),
                credentialURL=entry.get("credentialURL")
            )
            for entry in certifications
        ]

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        profile.certifications = cert_entries
        profile.save()

        # Serialize response
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Certifications updated successfully.",
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