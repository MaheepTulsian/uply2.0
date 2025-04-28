from bson import ObjectId

def mongo_to_dict(obj):
    """Custom serializer for MongoEngine documents"""
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: mongo_to_dict(v) for k, v in obj.items()}
    if hasattr(obj, '_data'):
        data = obj._data
        if 'id' not in data and hasattr(obj, 'id'):
            data['id'] = str(obj.id)
        return mongo_to_dict(data)
    if isinstance(obj, list):
        return [mongo_to_dict(v) for v in obj]
    return obj

def format_error_response(errors, status_code=400):
    """Format error response consistently"""
    if isinstance(errors, str):
        errors = [errors]
        
    return {
        "success": False,
        "status_code": status_code,
        "errors": errors
    }

def format_success_response(message, data=None):
    """Format success response consistently"""
    response = {
        "success": True,
        "message": message
    }
    
    if data is not None:
        response["data"] = data
        
    return response