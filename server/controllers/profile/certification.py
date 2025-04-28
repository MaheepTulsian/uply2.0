from bson import ObjectId
from models.profile_schema import Profile, Certification

def validate_certification(certification):
    """Validate a single certification entry"""
    errors = []
    
    # Required fields check
    required_fields = ["name", "issuingOrganization", "issueDate"]
    missing_fields = [field for field in required_fields if certification.get(field) is None]
    
    if missing_fields:
        errors.append(f"Missing required fields: {', '.join(missing_fields)}")
    
    # URL validation for credential URL if provided
    if certification.get("credentialURL") and not certification["credentialURL"].startswith(("http://", "https://")):
        errors.append("Credential URL must start with http:// or https://")
    
    return errors

def update_certifications(user_id, certifications):
    """Update a user's certifications"""
    
    # Validate input is an array
    if not isinstance(certifications, list) or len(certifications) == 0:
        return {"success": False, "errors": ["Certifications must be a non-empty array."]}
    
    # Validate each certification
    all_errors = []
    for i, cert in enumerate(certifications):
        errors = validate_certification(cert)
        if errors:
            all_errors.append(f"Certification #{i+1} ({cert.get('name', '')}): {', '.join(errors)}")
    
    if all_errors:
        return {"success": False, "errors": all_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Convert to Certification embedded documents
        certification_entries = [
            Certification(
                name=entry["name"],
                issuingOrganization=entry["issuingOrganization"],
                issueDate=entry["issueDate"],
                expirationDate=entry.get("expirationDate", ""),
                credentialId=entry.get("credentialId", ""),
                credentialURL=entry.get("credentialURL", "")
            )
            for entry in certifications
        ]
        
        # Replace existing certifications
        profile.certifications = certification_entries
        profile.save()
        
        return {
            "success": True,
            "message": "Certifications updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}