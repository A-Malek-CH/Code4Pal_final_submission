"""
Admin authentication routes for admin login/logout/token refresh
"""

from flask import Blueprint, request, jsonify
from api.DB.connection import supabase
from api.routes import success_response, error_response
from api.utils.auth import (
    hash_password,
    verify_password, 
    generate_admin_access_token,
    store_admin_refresh_token,
    verify_admin_refresh_token,
    invalidate_admin_refresh_token,
    require_admin_auth
)
from datetime import datetime, timezone

admin_auth_bp = Blueprint("admin_auth", __name__)


@admin_auth_bp.route("/login", methods=["POST"])
def admin_login():
    """Admin login with email and password"""
    try:
        data = request.json
        
        # Validate required fields
        if not data or not all(k in data for k in ('email', 'password')):
            return error_response("Email and password are required", 400)
        
        email = data.get('email')
        password = data.get('password')
        
        # Find admin by email
        admin_result = supabase.table("admins")\
            .select("id, email, name, password_hash, is_active")\
            .eq("email", email)\
            .eq("is_active", True)\
            .single()\
            .execute()
        
        if not admin_result.data:
            return error_response("Invalid credentials", 401)
        
        admin = admin_result.data
        
        # Verify password
        if not verify_password(password, admin['password_hash']):
            return error_response("Invalid credentials", 401)
        
        # Update last login
        supabase.table("admins")\
            .update({"last_login": datetime.now(timezone.utc).isoformat()})\
            .eq("id", admin['id'])\
            .execute()
        
        # Generate tokens
        access_token = generate_admin_access_token(admin['id'])
        refresh_token = store_admin_refresh_token(admin['id'])
        
        return success_response({
            "access_token": access_token,
            "refresh_token": refresh_token,
            "admin": {
                "id": admin['id'],
                "email": admin['email'],
                "name": admin['name']
            }
        })
        
    except Exception as e:
        return error_response(f"Login failed: {str(e)}", 500)


@admin_auth_bp.route("/refresh", methods=["POST"])
def admin_refresh_token():
    """Refresh admin access token using refresh token"""
    try:
        data = request.json
        
        if not data or 'refresh_token' not in data:
            return error_response("Refresh token is required", 400)
        
        refresh_token = data['refresh_token']
        
        # Verify refresh token
        token_data = verify_admin_refresh_token(refresh_token)
        if not token_data:
            return error_response("Invalid or expired refresh token", 401)
        
        admin_id = token_data['admin_id']
        
        # Verify admin still exists and is active
        admin_result = supabase.table("admins")\
            .select("id, email, name, is_active")\
            .eq("id", admin_id)\
            .eq("is_active", True)\
            .single()\
            .execute()
        
        if not admin_result.data:
            return error_response("Admin not found or inactive", 401)
        
        admin = admin_result.data
        
        # Generate new access token
        new_access_token = generate_admin_access_token(admin_id)
        
        return success_response({
            "access_token": new_access_token,
            "admin": {
                "id": admin['id'],
                "email": admin['email'],
                "name": admin['name']
            }
        })
        
    except Exception as e:
        return error_response(f"Token refresh failed: {str(e)}", 500)


@admin_auth_bp.route("/logout", methods=["POST"])
@require_admin_auth
def admin_logout():
    """Admin logout - invalidate refresh token"""
    try:
        data = request.json
        
        if not data or 'refresh_token' not in data:
            return error_response("Refresh token is required", 400)
        
        refresh_token = data['refresh_token']
        
        # Invalidate the refresh token
        success = invalidate_admin_refresh_token(refresh_token)
        
        if success:
            return success_response({"message": "Logged out successfully"})
        else:
            return error_response("Logout failed", 500)
        
    except Exception as e:
        return error_response(f"Logout failed: {str(e)}", 500)


@admin_auth_bp.route("/profile", methods=["GET"])
@require_admin_auth
def admin_profile():
    """Get admin profile information"""
    try:
        # Admin info is available from the decorator
        admin = request.current_admin
        
        return success_response({
            "admin": {
                "id": admin['id'],
                "email": admin['email'],
                "name": admin['name']
            }
        })
        
    except Exception as e:
        return error_response(f"Failed to get profile: {str(e)}", 500)


@admin_auth_bp.route("/change-password", methods=["POST"])
@require_admin_auth
def admin_change_password():
    """Change admin password"""
    try:
        data = request.json
        
        if not data or not all(k in data for k in ('current_password', 'new_password')):
            return error_response("Current password and new password are required", 400)
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        # Validate new password strength
        if len(new_password) < 8:
            return error_response("New password must be at least 8 characters long", 400)
        
        admin = request.current_admin
        admin_id = admin['id']
        
        # Get current password hash
        admin_result = supabase.table("admins")\
            .select("password_hash")\
            .eq("id", admin_id)\
            .single()\
            .execute()
        
        if not admin_result.data:
            return error_response("Admin not found", 404)
        
        # Verify current password
        if not verify_password(current_password, admin_result.data['password_hash']):
            return error_response("Current password is incorrect", 401)
        
        # Hash new password
        new_password_hash = hash_password(new_password)
        
        # Update password
        supabase.table("admins")\
            .update({"password_hash": new_password_hash})\
            .eq("id", admin_id)\
            .execute()
        
        return success_response({"message": "Password changed successfully"})
        
    except Exception as e:
        return error_response(f"Password change failed: {str(e)}", 500)