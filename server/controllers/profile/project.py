from bson import ObjectId
from datetime import datetime
import re
from models.profile_schema import Profile, Project

def validate_project(project):
    """Validate a single project entry"""
    errors = []
    
    # Required fields check
    if not all(key in project for key in ["title", "description", "startDate"]):
        errors.append("Title, description, and start date are required.")
    
    # Removed date validation - accepting dates as strings
    
    # Project link validation
    if project.get("projectLink") and not re.match(r'^https?://\S+$', project["projectLink"]):
        errors.append(f"Invalid project link format for {project.get('title', 'project')}.")
    
    # Technologies validation
    if "technologiesUsed" in project and not isinstance(project["technologiesUsed"], list):
        errors.append(f"Technologies used must be an array for {project.get('title', 'project')}.")
    
    return errors

def update_projects(user_id, projects):
    """Update a user's project information"""
    
    # Validate input is an array
    if not isinstance(projects, list) or len(projects) == 0:
        return {"success": False, "errors": ["Projects data must be a non-empty array."]}
    
    # Validate each project
    all_errors = []
    for i, project in enumerate(projects):
        errors = validate_project(project)
        if errors:
            all_errors.append(f"Project #{i+1} ({project.get('title', '')}): {', '.join(errors)}")
    
    if all_errors:
        return {"success": False, "errors": all_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Convert to Project embedded documents
        project_entries = [
            Project(
                title=entry["title"],
                description=entry["description"],
                startDate=entry["startDate"],
                endDate=entry.get("endDate", ""),
                technologiesUsed=entry.get("technologiesUsed", []),
                projectLink=entry.get("projectLink", ""),
                isOpenSource=entry.get("isOpenSource", False)
            )
            for entry in projects
        ]
        
        # Replace existing projects
        profile.projects = project_entries
        profile.save()
        
        return {
            "success": True,
            "message": "Projects updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}