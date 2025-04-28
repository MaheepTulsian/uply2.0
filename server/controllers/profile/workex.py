from bson import ObjectId
from models.profile_schema import Profile, WorkExperience

def validate_work_experience(experience):
    """Validate a single work experience entry"""
    errors = []
    
    # Required fields check
    required_fields = ["company", "position", "startDate", "isCurrent"]
    missing_fields = [field for field in required_fields if experience.get(field) is None]
    
    if missing_fields:
        errors.append(f"Missing required fields: {', '.join(missing_fields)}")
    
    # Validate isCurrent type
    if "isCurrent" in experience and not isinstance(experience["isCurrent"], bool):
        errors.append("isCurrent must be a boolean value.")
    
    # Logic for end date based on isCurrent
    if experience.get("isCurrent") is True and experience.get("endDate"):
        errors.append("End date should not be provided when isCurrent is true.")
    
    if experience.get("isCurrent") is False and not experience.get("endDate"):
        errors.append("End date is required when isCurrent is false.")
    
    return errors

def update_work_experience(user_id, experiences):
    """Update a user's work experience"""
    
    # Validate input is an array
    if not isinstance(experiences, list) or len(experiences) == 0:
        return {"success": False, "errors": ["Work experience must be a non-empty array."]}
    
    # Validate each work experience entry
    all_errors = []
    for i, exp in enumerate(experiences):
        errors = validate_work_experience(exp)
        if errors:
            all_errors.append(f"Experience #{i+1} ({exp.get('company', '')}): {', '.join(errors)}")
    
    if all_errors:
        return {"success": False, "errors": all_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Convert to WorkExperience embedded documents
        experience_entries = [
            WorkExperience(
                company=entry["company"],
                position=entry["position"],
                startDate=entry["startDate"],
                endDate=entry.get("endDate", ""),
                description=entry.get("description", ""),
                isCurrent=entry["isCurrent"]
            )
            for entry in experiences
        ]
        
        # Replace existing work experiences
        profile.workEx = experience_entries
        profile.save()
        
        return {
            "success": True,
            "message": "Work experience updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}