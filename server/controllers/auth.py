from firebase_admin import auth
from bson import ObjectId
from models.profile_schema import Profile
from utils.profile_utils import format_error_response, format_success_response
# controllers/auth.py - login_with_email function
import requests
import json

def signup_with_email(email, password, username):
    """
    Create a new user with email and password using Firebase Auth REST API
    """
    try:
        # Check if username already exists in MongoDB
        if Profile.objects(username=username):
            return format_error_response("Username already exists")
            
        # Firebase Auth REST API endpoint for sign-up
        auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBefAbp_xjn4pAxbkEwzco5Oz4UbxcDfv4"
        
        # Request payload
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        # Make the request
        response = requests.post(auth_url, data=json.dumps(payload))
        data = response.json()
        
        # Check for errors
        if response.status_code != 200:
            error_message = data.get("error", {}).get("message", "Registration failed")
            return format_error_response(error_message)
        
        # Get the new user's UID from the response
        uid = data.get("localId")
        
        # Update display name in Firebase
        auth.update_user(uid, display_name=username)
        
        # Create user profile in MongoDB
        new_user = Profile(
            username=username,
            password="",  # We don't store the password in MongoDB
            firebase_uid=uid
        )
        new_user.save()
        
        # Return success response with user ID and tokens
        return format_success_response(
            "User registered successfully", 
            {
                "userId": str(new_user.id),
                "email": email,
                "username": username,
                "uid": uid,
                "idToken": data.get("idToken"),
                "refreshToken": data.get("refreshToken")
            }
        )
    
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        return format_error_response(str(e))

def login_with_email(email, password):
    """
    Authenticate user with email and password using Firebase Auth REST API
    """
    try:
        # Firebase Auth REST API endpoint for sign-in
        auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBefAbp_xjn4pAxbkEwzco5Oz4UbxcDfv4"
        
        # Request payload
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        
        # Make the request
        response = requests.post(auth_url, data=json.dumps(payload))
        data = response.json()
        
        # Check for errors
        if response.status_code != 200:
            error_message = data.get("error", {}).get("message", "Authentication failed")
            return format_error_response(error_message)
        
        # Get user info from Firebase
        firebase_user = auth.get_user_by_email(email)
        
        # Find or create user profile in MongoDB
        profile = Profile.objects(firebase_uid=firebase_user.uid).first()
        if not profile:
            # Create profile if it doesn't exist
            profile = Profile(
                username=firebase_user.display_name or email.split('@')[0],
                password="",
                firebase_uid=firebase_user.uid
            )
            profile.save()
        
        # Return success with user data and tokens
        return format_success_response(
            "Login successful", 
            {
                "userId": str(profile.id),
                "email": firebase_user.email,
                "displayName": firebase_user.display_name,
                "uid": firebase_user.uid,
                "idToken": data.get("idToken"),
                "refreshToken": data.get("refreshToken")
            }
        )
    
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return format_error_response(str(e))

def verify_firebase_token(id_token):
    """
    Verify Firebase ID token
    
    Args:
        id_token: Firebase ID token from client
        
    Returns:
        Dict containing decoded token or error message
    """
    try:
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        
        # Get user by UID
        firebase_user = auth.get_user(decoded_token['uid'])
        
        # Find or create user in MongoDB
        profile = Profile.objects(firebase_uid=decoded_token['uid']).first()
        
        if not profile:
            # Create new profile for the user
            username = firebase_user.display_name or firebase_user.email.split('@')[0]
            
            # Check if username exists
            if Profile.objects(username=username):
                # Add a random suffix to make username unique
                import random
                username = f"{username}{random.randint(1000, 9999)}"
            
            profile = Profile(
                username=username,
                password="",
                firebase_uid=firebase_user.uid
            )
            profile.save()
        
        return format_success_response(
            "Token verified successfully", 
            {
                "userId": str(profile.id),
                "uid": firebase_user.uid,
                "email": firebase_user.email,
                "displayName": firebase_user.display_name
            }
        )
    
    except auth.InvalidIdTokenError:
        return format_error_response("Invalid token")
    
    except auth.ExpiredIdTokenError:
        return format_error_response("Token expired")
    
    except Exception as e:
        print(f"Error verifying token: {str(e)}")
        return format_error_response(str(e))

def logout_user(id_token):
    """
    Logout user by revoking their tokens
    
    Args:
        id_token: Firebase ID token
        
    Returns:
        Dict containing success status or error message
    """
    try:
        # Verify the token first
        decoded_token = auth.verify_id_token(id_token)
        
        # Revoke all refresh tokens for user
        auth.revoke_refresh_tokens(decoded_token['uid'])
        
        return format_success_response("Logout successful")
    
    except auth.InvalidIdTokenError:
        return format_error_response("Invalid token")
    
    except Exception as e:
        print(f"Error during logout: {str(e)}")
        return format_error_response(str(e))

def google_auth_controller(id_token):
    """
    Handle authentication with Google via Firebase
    
    Args:
        id_token: Firebase ID token from Google authentication
        
    Returns:
        Dict containing success status and user data or error message
    """
    # For Google auth, we just verify the token and handle user creation
    return verify_firebase_token(id_token)