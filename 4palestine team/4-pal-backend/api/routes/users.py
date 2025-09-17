from flask import Blueprint, request, jsonify
from api.DB.connection import supabase
from api.routes import success_response, error_response
from api.services.mail_services import send_confirmation_email, generate_code
from api.utils.auth import require_any_auth, require_user_auth, is_admin_authenticated
from datetime import datetime, timedelta, timezone


users_bp = Blueprint("users", __name__)

@users_bp.route("", methods=["GET"])
@require_any_auth
def list_users():
    try:
        response = supabase.table("users").select("*").execute()
        # Remove password hashes from response
        if response.data:
            for user in response.data:
                user.pop('password_hash', None)
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)

@users_bp.route("/<int:user_id>", methods=["GET"])
@require_any_auth
def get_user(user_id):
    try:
        response = supabase.table("users").select("*").eq("id", user_id).single().execute()
        if not response.data:
            return error_response("User not found", 404)
        # Remove password hash from response
        user_data = response.data
        user_data.pop('password_hash', None)
        return success_response(user_data)
    except Exception as e:
        return error_response(str(e), 500)

@users_bp.route("/add", methods=["POST"])
def create_user():
    try:
        # user_types = ('anonymous','registered','contributor','organization','admin')
        
        data = request.json
        if not data or "email" not in data:
            return {"error": "Email is required"}, 400

        # 1. Insert user
        user_response = supabase.table("users").insert(data).execute()
        if not user_response.data:
            return {"error": "User registration failed"}, 500

        # supabase returns list of inserted rows
        user = user_response.data[0]
        user_email = user["email"]
        user_id = user["id"]

        # 2. Generate code + send mail
        code = generate_code()
        sent = send_confirmation_email(user_email, code)
        if not sent:
            return {"error": "User created but failed to send confirmation email"}, 500

        # 3. Store verification record
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        insert_data = {
            "email": user_email,
            "code": code,
            "expires_at": expires_at.isoformat(),
            "verified": False
        }

        verif_response = supabase.table("email_verifications").insert(insert_data).execute()
        if not verif_response.data:
            return {"error": "User created but failed to store verification record"}, 500

        return {"message": "User created, confirmation code sent", "user": user}, 201

    except Exception as e:
        # general error fallback
        print("create_user error:", e)
        return {"error": "Internal server error", "details": str(e)}, 500

@users_bp.route("/verify_email", methods=["POST"])
def verify_user():
    try:
        data = request.json
        if not data or "email" not in data or "code" not in data:
            return {"error": "Email and code are required"}, 400

        email = data["email"]
        code = data["code"]

        # 1. Fetch latest verification record for this email
        verif_response = (
            supabase.table("email_verifications")
            .select("*")
            .eq("email", email)
            .order("expires_at", desc=True)  # get latest
            .limit(1)
            .execute()
        )

        if not verif_response.data:
            return error_response("No verification request found for this email", 404)

        verif_record = verif_response.data[0]

        # 2. Check if code matches
        if int(verif_record["code"]) != int(code):
            print(verif_record["code"], code)
            return error_response("Invalid confirmation code", 400)
        

        # 3. Check expiry
        expires_at = datetime.fromisoformat(verif_record["expires_at"])
        if datetime.now(timezone.utc) > expires_at:
            return error_response("Confirmation code has expired", 400)

        # 4. Mark verification as complete
        supabase.table("email_verifications").update({"verified": True}).eq("id", verif_record["id"]).execute()
        user_response = supabase.table("users").update({"is_email_verified": True, "user_type": "registered"}).eq("email", email).execute()
        user_data = user_response.data[0]

        return success_response(message="User email verified successfully", data= user_data, status=200)

    except Exception as e:
        print("verify_user error:", e)
    return error_response("Internal server error", 500, details=e)

@users_bp.route("/resend_code", methods=["POST"])
def resend_confirmation():
    try:
        data = request.json
        if not data or "email" not in data:
            return error_response("Email is required", 400)

        email = data["email"]

        # 1. Check if user exists
        user_response = supabase.table("users").select("id, email").eq("email", email).limit(1).execute()
        if not user_response.data:
            return error_response("User not found", 404)

        user = user_response.data[0]
        user_id = user["id"]

        # 2. Generate new code
        code = generate_code()

        # 3. Send confirmation email
        sent = send_confirmation_email(email, code)
        if not sent:
            return error_response("Failed to send confirmation email", 500)

        # 4. Store new verification record
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
        insert_data = {
            "email": email,
            "code": code,
            "expires_at": expires_at.isoformat(),
            "verified": False
        }

        verif_response = supabase.table("email_verifications").insert(insert_data).execute()
        if not verif_response.data:
            return error_response("Failed to store new verification record", 500)

        return success_response(
            message="New confirmation code sent",
            data={"user_id": user_id, "email": email},
            status=200
        )

    except Exception as e:
        print("resend_confirmation error:", e)
        return error_response("Internal server error", 500, details=e)

@users_bp.route("/<int:user_id>", methods=["PUT"])
@require_any_auth
def update_user(user_id):
    try:
        # Check if user is updating their own profile or is admin
        current_user = request.current_user
        is_admin = current_user.get('user_type') == 'admin'
        
        if current_user.get('user_id') != user_id and not is_admin:
            return error_response("Unauthorized to update this user", 403)
            
        data = request.json
        # Don't allow updating sensitive fields through this endpoint
        if 'password_hash' in data:
            data.pop('password_hash')
        
        # Only allow admins to change user_type
        if not is_admin and 'user_type' in data:
            data.pop('user_type')
            
        response = supabase.table("users").update(data).eq("id", user_id).execute()
        if not response.data:
            return error_response("User not found", 404)
        
        # Remove password hash from response
        user_data = response.data[0]
        user_data.pop('password_hash', None)
        return success_response(user_data)
    except Exception as e:
        return error_response(str(e), 500)

@users_bp.route("/<int:user_id>", methods=["DELETE"])
@require_any_auth
def delete_user(user_id):
    try:
        # Check if user is deleting their own profile or is admin
        current_user = request.current_user
        is_admin = current_user.get('user_type') == 'admin'
        
        if current_user.get('user_id') != user_id and not is_admin:
            return error_response("Unauthorized to delete this user", 403)
            
        response = supabase.table("users").delete().eq("id", user_id).execute()
        if not response.data:
            return error_response("User not found", 404)
        return success_response({"message": "User deleted"})
    except Exception as e:
        return error_response(str(e), 500)

