from bson import ObjectId
from models.profile_schema import Profile, Publication

def validate_publication(publication):
    """Validate a single publication entry"""
    errors = []
    
    # Required fields check
    required_fields = ["title", "publisher", "publicationDate"]
    missing_fields = [field for field in required_fields if publication.get(field) is None]
    
    if missing_fields:
        errors.append(f"Missing required fields: {', '.join(missing_fields)}")
    
    # Link validation if provided
    if publication.get("link") and not publication["link"].startswith(("http://", "https://")):
        errors.append("Publication link must start with http:// or https://")
    
    return errors

def update_publications(user_id, publications):
    """Update a user's publications"""
    
    # Validate input is an array
    if not isinstance(publications, list) or len(publications) == 0:
        return {"success": False, "errors": ["Publications must be a non-empty array."]}
    
    # Validate each publication
    all_errors = []
    for i, pub in enumerate(publications):
        errors = validate_publication(pub)
        if errors:
            all_errors.append(f"Publication #{i+1} ({pub.get('title', '')}): {', '.join(errors)}")
    
    if all_errors:
        return {"success": False, "errors": all_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Convert to Publication embedded documents
        publication_entries = [
            Publication(
                title=entry["title"],
                publisher=entry["publisher"],
                publicationDate=entry["publicationDate"],
                description=entry.get("description", ""),
                link=entry.get("link", "")
            )
            for entry in publications
        ]
        
        # Replace existing publications
        profile.publications = publication_entries
        profile.save()
        
        return {
            "success": True,
            "message": "Publications updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}