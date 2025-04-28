from bson import ObjectId
from models.profile_schema import Profile, Achievement

def validate_achievement(achievement):
    """Validate a single achievement entry"""
    errors = []
    
    # Required fields check
    required_fields = ["title", "date"]
    missing_fields = [field for field in required_fields if achievement.get(field) is None]
    
    if missing_fields:
        errors.append(f"Missing required fields: {', '.join(missing_fields)}")
    
    return errors

def update_achievements(user_id, achievements):
    """Update a user's achievements"""
    
    # Validate input is an array
    if not isinstance(achievements, list) or len(achievements) == 0:
        return {"success": False, "errors": ["Achievements must be a non-empty array."]}
    
    # Validate each achievement
    all_errors = []
    for i, achievement in enumerate(achievements):
        errors = validate_achievement(achievement)
        if errors:
            all_errors.append(f"Achievement #{i+1} ({achievement.get('title', '')}): {', '.join(errors)}")
    
    if all_errors:
        return {"success": False, "errors": all_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Convert to Achievement embedded documents
        achievement_entries = [
            Achievement(
                title=entry["title"],
                date=entry["date"],
                description=entry.get("description", ""),
                issuer=entry.get("issuer", "")
            )
            for entry in achievements
        ]
        
        # Replace existing achievements
        profile.achievements = achievement_entries
        profile.save()
        
        return {
            "success": True,
            "message": "Achievements updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}