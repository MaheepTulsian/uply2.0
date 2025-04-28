from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from models.profile_schema import Profile
from typing import Optional, Callable
from functools import wraps
import logging

security = HTTPBearer()
logger = logging.getLogger(__name__)

async def verify_token(authorization: HTTPAuthorizationCredentials = None) -> dict:
    """
    Verify Firebase JWT token
    
    Args:
        authorization: HTTP Authorization credentials containing the JWT
        
    Returns:
        Dictionary containing user info
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        token = authorization.credentials
        # Verify the Firebase JWT
        decoded_token = auth.verify_id_token(token)
        
        # Get Firebase user
        firebase_user = auth.get_user(decoded_token['uid'])
        
        # Find user in MongoDB
        user = Profile.objects(firebase_uid=decoded_token['uid']).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found in database",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Return user info
        return {
            "firebase_uid": firebase_user.uid,
            "user_id": str(user.id),
            "email": firebase_user.email,
            "username": user.username
        }
    
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found in Firebase",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

def auth_required(endpoint_function: Callable) -> Callable:
    """
    Decorator for endpoints that require authentication
    
    Args:
        endpoint_function: The FastAPI endpoint function to protect
        
    Returns:
        Wrapped function that checks authentication before calling the endpoint
    """
    @wraps(endpoint_function)
    async def wrapper(*args, request: Request, authorization: HTTPAuthorizationCredentials = None, **kwargs):
        user_info = await verify_token(authorization)
        
        # Add user_info to request state
        request.state.user = user_info
        
        # Call the original endpoint with all arguments
        return await endpoint_function(*args, request=request, **kwargs)
    
    return wrapper