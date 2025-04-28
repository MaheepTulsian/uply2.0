from bson import ObjectId
from models.profile_schema import Profile

def validate_skills(skills):
    """Validate skills array"""
    errors = []
    
    # Check if it's a list
    if not isinstance(skills, list) or len(skills) == 0:
        errors.append("Skills must be a non-empty array of strings.")
        return errors
    
    # Validate each skill is a non-empty string
    for i, skill in enumerate(skills):
        if not isinstance(skill, str) or not skill.strip():
            errors.append(f"Skill #{i+1} must be a non-empty string.")
    
    return errors

def update_skills(user_id, skills):
    """Update a user's skills"""
    
    # Validate skills
    validation_errors = validate_skills(skills)
    if validation_errors:
        return {"success": False, "errors": validation_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Update skills
        profile.skills = skills
        profile.save()
        
        return {
            "success": True,
            "message": "Skills updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}