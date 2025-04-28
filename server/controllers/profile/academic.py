from bson import ObjectId
from datetime import datetime
import re
from models.profile_schema import Profile, Academic

def validate_academic_record(record):
    """Validate a single academic record"""
    errors = []
    
    # Required fields check
    required_fields = ["institution", "degree", "fieldOfStudy", "startDate"]
    missing_fields = [field for field in required_fields if not record.get(field)]
    
    if missing_fields:
        errors.append(f"Missing required fields: {', '.join(missing_fields)}")
    
    # Removed date validation - accepting dates as strings
    
    # Grade format validation (if provided)
    if record.get("grade") and not re.match(r'^[A-Fa-f0-9.]+$', record["grade"]):
        errors.append(f"Invalid grade format for {record.get('institution', 'record')}.")
    
    return errors

def update_academic_info(user_id, academic_records):
    """Update a user's academic information"""
    
    # Validate input is an array
    if not isinstance(academic_records, list) or len(academic_records) == 0:
        return {"success": False, "errors": ["Academics data must be a non-empty array."]}
    
    # Validate each academic record
    all_errors = []
    for i, record in enumerate(academic_records):
        errors = validate_academic_record(record)
        if errors:
            all_errors.append(f"Record #{i+1} ({record.get('institution', '')}): {', '.join(errors)}")
    
    if all_errors:
        return {"success": False, "errors": all_errors}
    
    try:
        # Find the profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return {"success": False, "errors": ["User not found."]}
        
        # Convert to Academic embedded documents
        academic_entries = [
            Academic(
                institution=entry["institution"],
                degree=entry["degree"],
                fieldOfStudy=entry["fieldOfStudy"],
                startDate=entry["startDate"],
                endDate=entry.get("endDate", ""),
                description=entry.get("description", ""),
                grade=entry.get("grade", "")
            )
            for entry in academic_records
        ]
        
        # Replace existing academic entries
        profile.academic = academic_entries
        profile.save()
        
        return {
            "success": True,
            "message": "Academic records updated successfully.",
            "profile": profile
        }
        
    except Exception as e:
        return {"success": False, "errors": [str(e)]}