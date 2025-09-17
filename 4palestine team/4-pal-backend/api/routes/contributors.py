from flask import Blueprint, request
from api.DB.connection import supabase
from api.routes import success_response, error_response
from api.utils.auth import require_any_auth, require_contributor_auth, is_admin_authenticated

contributors_bp = Blueprint("contributors", __name__)

@contributors_bp.route("", methods=["GET"])
@require_any_auth
def list_contributors():
    try:
        response = supabase.table("contributor_data").select("*").execute()
        # Remove password hashes from response
        if response.data:
            for contributor in response.data:
                contributor.pop('password_hash', None)
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)

@contributors_bp.route("/<int:contributor_id>", methods=["GET"])
@require_any_auth
def get_contributor(contributor_id):
    try:
        response = supabase.table("contributor_data").select("*").eq("id", contributor_id).single().execute()
        if not response.data:
            return error_response("Contributor not found", 404)
        # Remove password hash from response
        contributor_data = response.data
        contributor_data.pop('password_hash', None)
        return success_response(contributor_data)
    except Exception as e:
        return error_response(str(e), 500)

@contributors_bp.route("", methods=["POST"])
def create_contributor():
    try:
        data = request.json
        response = supabase.table("contributor_data").insert(data).execute()
        return success_response(response.data, 201)
    except Exception as e:
        return error_response(str(e), 500)

@contributors_bp.route("/<int:contributor_id>", methods=["PUT"])
@require_any_auth
def update_contributor(contributor_id):
    try:
        # Check if contributor is updating their own profile or is admin
        current_user = request.current_user
        is_admin = current_user.get('user_type') == 'admin'
        
        if current_user.get('contributor_id') != contributor_id and not is_admin:
            return error_response("Unauthorized to update this contributor", 403)
            
        data = request.json
        # Don't allow updating sensitive fields through this endpoint
        if 'password_hash' in data:
            data.pop('password_hash')
        
        # Only allow admins to change verification status and verified flag
        if not is_admin:
            if 'verification_status' in data:
                data.pop('verification_status')
            if 'verified' in data:
                data.pop('verified')
            
        response = supabase.table("contributor_data").update(data).eq("id", contributor_id).execute()
        if not response.data:
            return error_response("Contributor not found", 404)
        
        # Remove password hash from response
        contributor_data = response.data[0]
        contributor_data.pop('password_hash', None)
        return success_response(contributor_data)
    except Exception as e:
        return error_response(str(e), 500)

@contributors_bp.route("/<int:contributor_id>", methods=["DELETE"])
@require_any_auth
def delete_contributor(contributor_id):
    try:
        # Check if contributor is deleting their own profile or is admin
        current_user = request.current_user
        is_admin = current_user.get('user_type') == 'admin'
        
        if current_user.get('contributor_id') != contributor_id and not is_admin:
            return error_response("Unauthorized to delete this contributor", 403)
            
        response = supabase.table("contributor_data").delete().eq("id", contributor_id).execute()
        if not response.data:
            return error_response("Contributor not found", 404)
        return success_response({"message": "Contributor deleted"})
    except Exception as e:
        return error_response(str(e), 500)
