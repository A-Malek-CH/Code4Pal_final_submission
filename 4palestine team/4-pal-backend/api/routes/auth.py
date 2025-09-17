"""
Authentication routes for user and contributor login/logout/token refresh
"""

from flask import Blueprint, request, jsonify
from api.DB.connection import supabase
from api.routes import success_response, error_response
from api.utils.auth import (
    hash_password,
    verify_password, 
    generate_access_token,
    store_refresh_token,
    verify_refresh_token,
    invalidate_refresh_token,
    require_any_auth
)


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register/user", methods=["POST"])
def register_user():
    """Register a new user with email and password"""
    try:
        data = request.json
        
        # Validate required fields
        if not data or not all(k in data for k in ('email', 'password')):
            return error_response("Email and password are required", 400)
        
        email = data.get('email')
        password = data.get('password')
        
        # Validate password strength (basic validation)
        if len(password) < 8:
            return error_response("Password must be at least 8 characters long", 400)
        
        # Check if user already exists
        existing_user = supabase.table("users").select("id").eq("email", email).execute()
        if existing_user.data:
            return error_response("User with this email already exists", 409)
        
        # Hash password and prepare user data
        password_hash = hash_password(password)
        user_data = {
            'email': email,
            'password_hash': password_hash,
            'user_type': data.get('user_type', 'registered'),
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'phone_number': data.get('phone_number'),
            'preferred_language': data.get('preferred_language', 'en')
        }
        
        # Insert user
        user_response = supabase.table("users").insert(user_data).execute()
        if not user_response.data:
            return error_response("User registration failed", 500)
            
        user = user_response.data[0]
        
        # Generate tokens
        access_token = generate_access_token(user['id'], 'user')
        refresh_token = store_refresh_token(user_id=user['id'])
        
        # Remove password_hash from response
        user.pop('password_hash', None)
        
        return success_response(
            data={
                'user': user,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'Bearer'
            },
            status=201
        )
        
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route("/register/contributor", methods=["POST"])
def register_contributor():
    """Register a new contributor with email and password"""
    try:
        data = request.json
        
        # Validate required fields
        if not data or not all(k in data for k in ('email', 'password', 'contributor_type')):
            return error_response("Email, password, and contributor_type are required", 400)
        
        email = data.get('email')
        password = data.get('password')
        contributor_type = data.get('contributor_type')
        
        # Validate password strength
        if len(password) < 8:
            return error_response("Password must be at least 8 characters long", 400)
            
        # Validate contributor type
        if contributor_type not in ['individual', 'organization']:
            return error_response("Invalid contributor type", 400)
        
        # Check if user already exists
        existing_user = supabase.table("users").select("id").eq("email", email).execute()
        if existing_user.data:
            return error_response("User with this email already exists", 409)
        
        # Hash password and prepare user data
        password_hash = hash_password(password)
        user_data = {
            'email': email,
            'password_hash': password_hash,
            'user_type': 'contributor',
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'phone_number': data.get('phone_number'),
            'preferred_language': data.get('preferred_language', 'en')
        }
        
        # Insert user first
        user_response = supabase.table("users").insert(user_data).execute()
        if not user_response.data:
            return error_response("User registration failed", 500)
            
        user = user_response.data[0]
        
        # Prepare contributor data
        contributor_password_hash = hash_password(password)  # Separate password for contributor
        contributor_data = {
            'user_id': user['id'],
            'contributor_type': contributor_type,
            'verification_status': 'pending',
            'verified': False,
            'motivation': data.get('motivation'),
            'password_hash': contributor_password_hash
        }
        
        # Insert contributor data
        contributor_response = supabase.table("contributor_data").insert(contributor_data).execute()
        if not contributor_response.data:
            return error_response("Contributor registration failed", 500)
            
        contributor = contributor_response.data[0]
        
        # Generate tokens
        access_token = generate_access_token(user['id'], 'contributor', contributor['id'])
        refresh_token = store_refresh_token(contributor_id=contributor['id'])
        
        # Remove password_hash from responses
        user.pop('password_hash', None)
        contributor.pop('password_hash', None)
        
        return success_response(
            data={
                'user': user,
                'contributor': contributor,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'Bearer'
            },
            status=201
        )
        
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route("/login/user", methods=["POST"])
def login_user():
    """Login user with email and password"""
    try:
        data = request.json
        
        if not data or not all(k in data for k in ('email', 'password')):
            return error_response("Email and password are required", 400)
        
        email = data.get('email')
        password = data.get('password')
        
        # Find user by email
        user_response = supabase.table("users")\
            .select("*")\
            .eq("email", email)\
            .neq("user_type", "contributor")\
            .single()\
            .execute()
            
        if not user_response.data:
            return error_response("Invalid email or password", 401)
        
        user = user_response.data
        
        # Verify password
        if not user.get('password_hash') or not verify_password(password, user['password_hash']):
            return error_response("Invalid email or password", 401)
        
        # Generate tokens
        access_token = generate_access_token(user['id'], 'user')
        refresh_token = store_refresh_token(user_id=user['id'])
        
        # Remove password_hash from response
        user.pop('password_hash', None)
        
        return success_response({
            'user': user,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        })
        
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route("/login/contributor", methods=["POST"])
def login_contributor():
    """Login contributor with email and password"""
    try:
        data = request.json
        
        if not data or not all(k in data for k in ('email', 'password')):
            return error_response("Email and password are required", 400)
        
        email = data.get('email')
        password = data.get('password')
        
        # Find user and contributor data
        user_response = supabase.table("users")\
            .select("*, contributor_data(*)")\
            .eq("email", email)\
            .eq("user_type", "contributor")\
            .single()\
            .execute()
            
        if not user_response.data or not user_response.data.get('contributor_data'):
            return error_response("Invalid email or password", 401)
        
        user = user_response.data
        contributor_data = user['contributor_data'][0] if user['contributor_data'] else None
        
        if not contributor_data:
            return error_response("Contributor account not found", 401)
        
        # Verify password (check contributor password first, fallback to user password)
        password_valid = False
        if contributor_data.get('password_hash'):
            password_valid = verify_password(password, contributor_data['password_hash'])
        elif user.get('password_hash'):
            password_valid = verify_password(password, user['password_hash'])
        
        if not password_valid:
            return error_response("Invalid email or password", 401)
        
        # Check if contributor is verified
        if not contributor_data.get('verified', False):
            return error_response("Contributor account is not verified yet", 403)
        
        # Generate tokens
        access_token = generate_access_token(user['id'], 'contributor', contributor_data['id'])
        refresh_token = store_refresh_token(contributor_id=contributor_data['id'])
        
        # Clean up response data
        user.pop('password_hash', None)
        contributor_data.pop('password_hash', None)
        user.pop('contributor_data', None)
        
        return success_response({
            'user': user,
            'contributor': contributor_data,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer'
        })
        
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route("/refresh", methods=["POST"])
def refresh_token():
    """Refresh access token using refresh token"""
    try:
        data = request.json
        
        if not data or 'refresh_token' not in data:
            return error_response("Refresh token is required", 400)
        
        refresh_token_str = data['refresh_token']
        
        # Verify refresh token
        token_data = verify_refresh_token(refresh_token_str)
        if not token_data:
            return error_response("Invalid or expired refresh token", 401)
        
        # Generate new access token
        if token_data.get('user_id'):
            # User token
            new_access_token = generate_access_token(token_data['user_id'], 'user')
        elif token_data.get('contributor_id'):
            # Contributor token - need to get user_id
            contributor_response = supabase.table("contributor_data")\
                .select("user_id")\
                .eq("id", token_data['contributor_id'])\
                .single()\
                .execute()
            
            if not contributor_response.data:
                return error_response("Contributor not found", 404)
            
            new_access_token = generate_access_token(
                contributor_response.data['user_id'], 
                'contributor', 
                token_data['contributor_id']
            )
        else:
            return error_response("Invalid token data", 401)
        
        return success_response({
            'access_token': new_access_token,
            'token_type': 'Bearer'
        })
        
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route("/logout", methods=["POST"])
@require_any_auth
def logout():
    """Logout user/contributor and invalidate refresh token"""
    try:
        data = request.json
        
        if not data or 'refresh_token' not in data:
            return error_response("Refresh token is required", 400)
        
        refresh_token_str = data['refresh_token']
        
        # Invalidate refresh token
        if invalidate_refresh_token(refresh_token_str):
            return success_response({"message": "Logged out successfully"})
        else:
            return error_response("Failed to logout", 500)
        
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route("/me", methods=["GET"])
@require_any_auth
def get_current_user():
    """Get current authenticated user information"""
    try:
        current_user = request.current_user
        user_id = current_user['user_id']
        user_type = current_user['user_type']
        
        if user_type == 'user':
            # Get user data
            user_response = supabase.table("users")\
                .select("*")\
                .eq("id", user_id)\
                .single()\
                .execute()
                
            if not user_response.data:
                return error_response("User not found", 404)
            
            user_data = user_response.data
            user_data.pop('password_hash', None)
            
            return success_response({'user': user_data})
            
        elif user_type == 'contributor':
            # Get user and contributor data
            contributor_id = current_user['contributor_id']
            
            user_response = supabase.table("users")\
                .select("*")\
                .eq("id", user_id)\
                .single()\
                .execute()
                
            contributor_response = supabase.table("contributor_data")\
                .select("*")\
                .eq("id", contributor_id)\
                .single()\
                .execute()
            
            if not user_response.data or not contributor_response.data:
                return error_response("User or contributor not found", 404)
            
            user_data = user_response.data
            contributor_data = contributor_response.data
            
            user_data.pop('password_hash', None)
            contributor_data.pop('password_hash', None)
            
            return success_response({
                'user': user_data,
                'contributor': contributor_data
            })
        
        return error_response("Invalid user type", 400)
        
    except Exception as e:
        return error_response(str(e), 500)


@auth_bp.route("/change-password", methods=["POST"])
@require_any_auth
def change_password():
    """Change password for authenticated user or contributor"""
    try:
        data = request.json
        current_user = request.current_user
        
        if not data or not all(k in data for k in ('current_password', 'new_password')):
            return error_response("Current password and new password are required", 400)
        
        current_password = data['current_password']
        new_password = data['new_password']
        
        # Validate new password strength
        if len(new_password) < 8:
            return error_response("New password must be at least 8 characters long", 400)
        
        user_id = current_user['user_id']
        user_type = current_user['user_type']
        
        if user_type == 'user':
            # Update user password
            user_response = supabase.table("users")\
                .select("password_hash")\
                .eq("id", user_id)\
                .single()\
                .execute()
                
            if not user_response.data or not user_response.data.get('password_hash'):
                return error_response("Current password not set", 400)
            
            # Verify current password
            if not verify_password(current_password, user_response.data['password_hash']):
                return error_response("Current password is incorrect", 401)
            
            # Update with new password
            new_password_hash = hash_password(new_password)
            supabase.table("users")\
                .update({'password_hash': new_password_hash})\
                .eq("id", user_id)\
                .execute()
                
        elif user_type == 'contributor':
            # Update contributor password
            contributor_id = current_user['contributor_id']
            
            contributor_response = supabase.table("contributor_data")\
                .select("password_hash")\
                .eq("id", contributor_id)\
                .single()\
                .execute()
                
            if not contributor_response.data:
                return error_response("Contributor not found", 404)
            
            current_hash = contributor_response.data.get('password_hash')
            if not current_hash:
                # Fallback to user password if contributor password not set
                user_response = supabase.table("users")\
                    .select("password_hash")\
                    .eq("id", user_id)\
                    .single()\
                    .execute()
                    
                if not user_response.data or not user_response.data.get('password_hash'):
                    return error_response("Current password not set", 400)
                current_hash = user_response.data['password_hash']
            
            # Verify current password
            if not verify_password(current_password, current_hash):
                return error_response("Current password is incorrect", 401)
            
            # Update with new password
            new_password_hash = hash_password(new_password)
            supabase.table("contributor_data")\
                .update({'password_hash': new_password_hash})\
                .eq("id", contributor_id)\
                .execute()
        
        # Invalidate all existing refresh tokens for security
        if user_type == 'user':
            supabase.table('refresh_tokens')\
                .update({'is_active': False})\
                .eq('user_id', user_id)\
                .execute()
        else:
            supabase.table('refresh_tokens')\
                .update({'is_active': False})\
                .eq('contributor_id', current_user['contributor_id'])\
                .execute()
        
        return success_response({"message": "Password changed successfully"})
        
    except Exception as e:
        return error_response(str(e), 500)