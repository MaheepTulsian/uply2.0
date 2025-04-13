from fastapi import APIRouter, HTTPException, Body, status
from bson import ObjectId
from fastapi.encoders import jsonable_encoder
from datetime import datetime
import re
from models.profile_schema import Profile, Project

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

@router.post("/{user_id}/project_info", status_code=status.HTTP_200_OK)
async def update_projects(
    user_id: str,
    projects: list[dict] = Body(..., embed=True)
):
    try:
        # Validate input array
        if not isinstance(projects, list) or len(projects) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Projects data must be a non-empty array."
            )

        # Validate each project entry
        for project in projects:
            # Required fields check
            if not all(key in project for key in ["title", "description"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Title and description are required for each project."
                )

            # Date validation
            start_date = datetime.strptime(project["startDate"], "%Y-%m-%d")
            end_date = None
            
            if project.get("endDate"):
                end_date = datetime.strptime(project["endDate"], "%Y-%m-%d")
                if start_date >= end_date:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"End date must be after start date for {project['title']}."
                    )

            # Project link validation
            if project.get("projectLink") and not re.match(r'^https?://\S+$', project["projectLink"]):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid project link format for {project['title']}."
                )

            # Technologies validation
            if "technologiesUsed" in project and not isinstance(project["technologiesUsed"], list):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Technologies used must be an array for {project['title']}."
                )

        # Convert to Project embedded documents
        project_entries = [
            Project(
                title=entry["title"],
                description=entry["description"],
                startDate=datetime.strptime(entry["startDate"], "%Y-%m-%d"),
                endDate=datetime.strptime(entry["endDate"], "%Y-%m-%d") if entry.get("endDate") else None,
                technologiesUsed=entry.get("technologiesUsed", []),
                projectLink=entry.get("projectLink"),
                isOpenSource=entry.get("isOpenSource", False)
            )
            for entry in projects
        ]

        # Update profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found."
            )

        # Replace existing projects
        profile.projects = project_entries
        profile.save()

        # Convert to serializable format
        profile_data = mongo_to_dict(profile)
        serialized_profile = jsonable_encoder(profile_data)

        return {
            "message": "Projects updated successfully.",
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