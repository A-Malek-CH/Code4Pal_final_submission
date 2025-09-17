"""
Authentication utilities for password hashing, JWT token management, and authentication middleware.
"""

import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify, current_app
from api.DB.connection import supabase
import secrets
import hashlib
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class AuthConfig:
    """Configuration class for authentication settings"""
    
    def __init__(self):
        self.JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-jwt-key-change-in-production')
        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Access token expires in 1 hour
        self.JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Refresh token expires in 30 days
        self.JWT_ALGORITHM = 'HS256'


auth_config = AuthConfig()


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password (str): Plain text password
        
    Returns:
        str: Hashed password
    """
    # Generate salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """
    Verify a password against its hash
    
    Args:
        password (str): Plain text password
        hashed (str): Hashed password from database
        
    Returns:
        bool: True if password matches, False otherwise
    """
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def generate_access_token(user_id: int, user_type: str, contributor_id: int = None) -> str:
    """
    Generate JWT access token
    
    Args:
        user_id (int): User ID
        user_type (str): Type of user ('user' or 'contributor')
        contributor_id (int, optional): Contributor ID if user_type is 'contributor'
        
    Returns:
        str: JWT access token
    """
    payload = {
        'user_id': user_id,
        'user_type': user_type,
        'exp': datetime.now(timezone.utc) + auth_config.JWT_ACCESS_TOKEN_EXPIRES,
        'iat': datetime.now(timezone.utc),
        'type': 'access'
    }
    
    if contributor_id:
        payload['contributor_id'] = contributor_id
    
    return jwt.encode(payload, auth_config.JWT_SECRET_KEY, algorithm=auth_config.JWT_ALGORITHM)


def generate_refresh_token() -> str:
    """
    Generate a secure random refresh token
    
    Returns:
        str: Refresh token
    """
    return secrets.token_urlsafe(64)


def hash_refresh_token(token: str) -> str:
    """
    Hash refresh token for secure storage
    
    Args:
        token (str): Raw refresh token
        
    Returns:
        str: Hashed refresh token
    """
    return hashlib.sha256(token.encode()).hexdigest()


def store_refresh_token(user_id: int = None, contributor_id: int = None, token: str = None) -> str:
    """
    Store refresh token in database
    
    Args:
        user_id (int, optional): User ID
        contributor_id (int, optional): Contributor ID
        token (str, optional): Refresh token (generated if not provided)
        
    Returns:
        str: The refresh token
    """
    if not token:
        token = generate_refresh_token()
    
    token_hash = hash_refresh_token(token)
    expires_at = datetime.now(timezone.utc) + auth_config.JWT_REFRESH_TOKEN_EXPIRES
    
    refresh_data = {
        'token_hash': token_hash,
        'expires_at': expires_at.isoformat(),
        'is_active': True
    }
    
    if user_id:
        refresh_data['user_id'] = user_id
    elif contributor_id:
        refresh_data['contributor_id'] = contributor_id
    else:
        raise ValueError("Either user_id or contributor_id must be provided")
    
    try:
        supabase.table('refresh_tokens').insert(refresh_data).execute()
        return token
    except Exception as e:
        raise Exception(f"Failed to store refresh token: {str(e)}")


def verify_refresh_token(token: str) -> dict:
    """
    Verify and retrieve refresh token data
    
    Args:
        token (str): Refresh token to verify
        
    Returns:
        dict: Token data if valid, None if invalid
    """
    token_hash = hash_refresh_token(token)
    
    try:
        response = supabase.table('refresh_tokens')\
            .select('*')\
            .eq('token_hash', token_hash)\
            .eq('is_active', True)\
            .gte('expires_at', datetime.now(timezone.utc).isoformat())\
            .single()\
            .execute()
        
        return response.data if response.data else None
    except Exception:
        return None


def invalidate_refresh_token(token: str) -> bool:
    """
    Invalidate a refresh token (logout)
    
    Args:
        token (str): Refresh token to invalidate
        
    Returns:
        bool: True if successful, False otherwise
    """
    token_hash = hash_refresh_token(token)
    
    try:
        supabase.table('refresh_tokens')\
            .update({'is_active': False})\
            .eq('token_hash', token_hash)\
            .execute()
        return True
    except Exception:
        return False


def decode_access_token(token: str) -> dict:
    """
    Decode and verify JWT access token
    
    Args:
        token (str): JWT access token
        
    Returns:
        dict: Decoded token payload if valid
        
    Raises:
        jwt.ExpiredSignatureError: Token has expired
        jwt.InvalidTokenError: Token is invalid
    """
    return jwt.decode(token, auth_config.JWT_SECRET_KEY, algorithms=[auth_config.JWT_ALGORITHM])


def get_token_from_header(request) -> str:
    """
    Extract JWT token from Authorization header
    
    Args:
        request: Flask request object
        
    Returns:
        str: JWT token if found, None otherwise
    """
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]
    return None


def require_auth(user_types: list = None):
    """
    Decorator to require authentication for routes
    
    Args:
        user_types (list, optional): List of allowed user types ['user', 'contributor']
    
    Returns:
        Function decorator
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = get_token_from_header(request)
            
            if not token:
                return jsonify({'error': 'No token provided'}), 401
            
            try:
                payload = decode_access_token(token)
                
                # Check if token type is access token
                if payload.get('type') != 'access':
                    return jsonify({'error': 'Invalid token type'}), 401
                
                # Check user type if specified
                if user_types and payload.get('user_type') not in user_types:
                    return jsonify({'error': 'Insufficient permissions'}), 403
                
                # Add user info to request context
                if payload.get('user_type') == 'admin':
                    # For admin tokens, we need to verify the admin exists and get admin info
                    admin_id = payload.get('admin_id')
                    if admin_id:
                        try:
                            admin_result = supabase.table('admins')\
                                .select('id, email, name, is_active')\
                                .eq('id', admin_id)\
                                .eq('is_active', True)\
                                .single()\
                                .execute()
                            
                            if admin_result.data:
                                request.current_user = {
                                    'admin_id': admin_id,
                                    'user_type': 'admin',
                                    'user_id': None,
                                    'contributor_id': None
                                }
                                request.current_admin = admin_result.data
                            else:
                                return jsonify({'error': 'Admin not found or inactive'}), 401
                        except Exception:
                            return jsonify({'error': 'Admin verification failed'}), 401
                    else:
                        return jsonify({'error': 'Invalid admin token'}), 401
                else:
                    request.current_user = {
                        'user_id': payload.get('user_id'),
                        'user_type': payload.get('user_type'),
                        'contributor_id': payload.get('contributor_id')
                    }
                
                return f(*args, **kwargs)
                
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 401
            except Exception as e:
                return jsonify({'error': 'Authentication failed'}), 401
        
        return decorated_function
    return decorator


def require_user_auth(f):
    """Decorator to require user authentication"""
    return require_auth(['user'])(f)


def require_contributor_auth(f):
    """Decorator to require contributor authentication"""
    return require_auth(['contributor'])(f)


def require_any_auth(f):
    """Decorator to require any type of authentication"""
    return require_auth(['user', 'contributor', 'admin'])(f)


# Admin Authentication Functions

def generate_admin_access_token(admin_id: int) -> str:
    """
    Generate JWT access token for admin
    
    Args:
        admin_id (int): Admin ID
        
    Returns:
        str: JWT access token
    """
    payload = {
        'admin_id': admin_id,
        'user_type': 'admin',
        'exp': datetime.now(timezone.utc) + auth_config.JWT_ACCESS_TOKEN_EXPIRES,
        'iat': datetime.now(timezone.utc),
        'type': 'access'
    }
    
    return jwt.encode(payload, auth_config.JWT_SECRET_KEY, algorithm=auth_config.JWT_ALGORITHM)


def store_admin_refresh_token(admin_id: int, token: str = None) -> str:
    """
    Store admin refresh token in database
    
    Args:
        admin_id (int): Admin ID
        token (str, optional): Refresh token (generated if not provided)
        
    Returns:
        str: The refresh token
    """
    if not token:
        token = generate_refresh_token()
    
    token_hash = hash_refresh_token(token)
    expires_at = datetime.now(timezone.utc) + auth_config.JWT_REFRESH_TOKEN_EXPIRES
    
    refresh_data = {
        'admin_id': admin_id,
        'token_hash': token_hash,
        'expires_at': expires_at.isoformat(),
        'is_active': True
    }
    
    try:
        supabase.table('admin_refresh_tokens').insert(refresh_data).execute()
        return token
    except Exception as e:
        raise Exception(f"Failed to store admin refresh token: {str(e)}")


def verify_admin_refresh_token(token: str) -> dict:
    """
    Verify and retrieve admin refresh token data
    
    Args:
        token (str): Admin refresh token to verify
        
    Returns:
        dict: Token data if valid, None if invalid
    """
    token_hash = hash_refresh_token(token)
    
    try:
        response = supabase.table('admin_refresh_tokens')\
            .select('*')\
            .eq('token_hash', token_hash)\
            .eq('is_active', True)\
            .gte('expires_at', datetime.now(timezone.utc).isoformat())\
            .single()\
            .execute()
        
        return response.data if response.data else None
    except Exception:
        return None


def invalidate_admin_refresh_token(token: str) -> bool:
    """
    Invalidate an admin refresh token (logout)
    
    Args:
        token (str): Admin refresh token to invalidate
        
    Returns:
        bool: True if successful, False otherwise
    """
    token_hash = hash_refresh_token(token)
    
    try:
        supabase.table('admin_refresh_tokens')\
            .update({'is_active': False})\
            .eq('token_hash', token_hash)\
            .execute()
        return True
    except Exception:
        return False


def require_admin_auth(f):
    """
    Decorator to require admin authentication for routes
    
    Returns:
        Function decorator
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = get_token_from_header(request)
        
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            payload = decode_access_token(token)
            
            # Check if token type is access token
            if payload.get('type') != 'access':
                return jsonify({'error': 'Invalid token type'}), 401
            
            # Check if user is admin
            if payload.get('user_type') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            
            # Verify admin exists and is active
            admin_id = payload.get('admin_id')
            if not admin_id:
                return jsonify({'error': 'Invalid admin token'}), 401
            
            try:
                admin_result = supabase.table('admins')\
                    .select('id, email, name, is_active')\
                    .eq('id', admin_id)\
                    .eq('is_active', True)\
                    .single()\
                    .execute()
                
                if not admin_result.data:
                    return jsonify({'error': 'Admin not found or inactive'}), 401
                
                # Add admin info to request context
                request.current_admin = admin_result.data
                
            except Exception:
                return jsonify({'error': 'Admin verification failed'}), 401
            
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': 'Authentication failed'}), 401
    
    return decorated_function


def is_admin_authenticated(request) -> bool:
    """
    Check if the current request is from an authenticated admin
    
    Args:
        request: Flask request object
        
    Returns:
        bool: True if admin is authenticated, False otherwise
    """
    token = get_token_from_header(request)
    
    if not token:
        return False
    
    try:
        payload = decode_access_token(token)
        
        # Check if token is admin token
        if payload.get('user_type') != 'admin' or payload.get('type') != 'access':
            return False
        
        # Verify admin exists and is active
        admin_id = payload.get('admin_id')
        if not admin_id:
            return False
        
        admin_result = supabase.table('admins')\
            .select('id')\
            .eq('id', admin_id)\
            .eq('is_active', True)\
            .single()\
            .execute()
        
        return bool(admin_result.data)
        
    except Exception:
        return False