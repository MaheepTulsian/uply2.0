from bson import ObjectId
import re
from models.profile_schema import Profile, Social

def validate_social_links(socials):
    """Validate social media links"""
    errors = []
    
    # Check if at least one social is provided
    if not any(value for value in socials.values() if value is not None):
        errors.append("At least one social link is required.")
    
    # Simple URL validation for provided links
    url_regex = r"^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/[\w\d\-./?%&=]*)?$"
    
    for platform, url in socials.items():
        if url is not None and url != "" and not re.match(url_regex, url):
            errors.append(f"Invalid URL format for {platform}")
    
    return errors

def update_social_links(user_id, socials_update):
    """Update a user's social media links"""
    
    # Validate social links
    validation_errors = validate_social_links(socials_update)
    if validation_errors:
        return {"success": False, "errors": validation_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Create update dictionary, removing None values
        update_data = {key: value for key, value in socials_update.items() if value is not None}
        
        # Initialize socials if it doesn't exist
        if not profile.socials:
            profile.socials = Social()
        
        # Update each social field
        for field, value in update_data.items():
            setattr(profile.socials, field, value)
        
        profile.save()
        
        return {
            "success": True,
            "message": "Social links updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}