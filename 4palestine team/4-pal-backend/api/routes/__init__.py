def success_response(data=None, message=None, status=200):
    return {
        "success": True,
        "message": message,
        "data": data
    }, status

def error_response(message="An error occurred", status=400, details=None):
    return {
        "success": False,
        "message": str(message),  # ensures exceptions become strings
        "details": str(details) if details else None
    }, status
