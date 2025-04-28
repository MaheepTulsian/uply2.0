from bson import ObjectId
import re
from models.profile_schema import Profile, PersonalInfo, Address
from utils.profile_utils import mongo_to_dict, format_error_response, format_success_response

def validate_personal_info(payload):
    """Validate the personal information payload"""
    errors = []
    
    # Extract fields from payload
    first_name = payload.get("firstName")
    last_name = payload.get("lastName")
    email = payload.get("email")
    phone = payload.get("phone")
    
    # Required field validation
    if not all([first_name, last_name, email, phone]):
        errors.append("First name, last name, email, and phone are required.")

    # Validate email format
    if email and not re.match(r'^\S+@\S+\.\S+$', email):
        errors.append("Invalid email format.")
    
    # We're no longer validating date format, accepting it as a string
    
    return errors

def check_email_exists(email, user_id):
    """Check if email exists for another user"""
    existing_user = Profile.objects(
        personalInfo__email=email,
        id__ne=ObjectId(user_id)
    ).first()
    return existing_user is not None

def update_personal_info(user_id, payload):
    """Update a user's personal information"""
    # Validation
    validation_errors = validate_personal_info(payload)
    if validation_errors:
        return format_error_response(validation_errors)
    
    # Check email uniqueness
    if payload.get("email") and check_email_exists(payload["email"], user_id):
        return format_error_response("Email is already in use by another account.")
    
    try:
        # Find the user profile
        profile = Profile.objects(id=ObjectId(user_id)).first()
        if not profile:
            return format_error_response("User not found.", 404)
        
        # Prepare address object
        address = None
        address_data = payload.get("address")
        if address_data:
            address = Address(
                street=address_data.get("street"),
                city=address_data.get("city"),
                state=address_data.get("state"),
                country=address_data.get("country"),
                zipCode=address_data.get("zipCode")
            )
        
        # Create/update personal info
        profile.personalInfo = PersonalInfo(
            firstName=payload.get("firstName"),
            lastName=payload.get("lastName"),
            email=payload.get("email"),
            phone=payload.get("phone"),
            dateOfBirth=payload.get("dateOfBirth"),
            address=address,
            resume=payload.get("resume")
        )
        
        profile.save()
        
        # Convert to dict for serialization
        profile_dict = mongo_to_dict(profile)
        
        return format_success_response(
            "Profile updated successfully.",
            {"profile": profile_dict}
        )
        
    except Exception as e:
        return format_error_response(str(e), 500)