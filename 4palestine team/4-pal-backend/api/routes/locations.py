from flask import Blueprint, request
from api.DB.connection import supabase
from api.routes import success_response, error_response

locations_bp = Blueprint("locations", __name__)

@locations_bp.route("", methods=["GET"])
def list_locations():
    try:
        response = supabase.table("locations").select("*").execute()
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)

@locations_bp.route("/<int:location_id>", methods=["GET"])
def get_location(location_id):
    try:
        response = supabase.table("locations").select("*").eq("id", location_id).single().execute()
        if not response.data:
            return error_response("Location not found", 404)
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)
    

@locations_bp.route("/add", methods=["POST"])
def create_location():
    try:
        data = request.json
        if not data:
            return error_response("Request body is required", 400)

        # Insert into locations
        try:
            location_response = supabase.table("locations").insert(data).execute()
        except Exception as e:
            return error_response(f"Failed to insert location: {str(e)}", 500)

        if not location_response.data or "id" not in location_response.data[0]:
            return error_response("Location insert did not return an ID", 500)

        location_id = location_response.data[0]["id"]

        # Insert into location_verifications
        try:
            body = {
                "location_id": location_id,
                "status": "unverified"
            }
            verification_response = supabase.table("location_verifications").insert(body).execute()
        except Exception as e:
            return error_response(f"Failed to create location verification: {str(e)}", 500)

        if not verification_response.data:
            return error_response("Location verification insert failed", 500)

        return success_response(verification_response.data, 201)

    except Exception as e:
        return error_response(f"Unexpected error: {str(e)}", 500)

@locations_bp.route("/verify", methods=["POST"])
def verify_location():
    try:
        data = request.json
        if not data or "admin_id" not in data or "location_id" not in data or "status" not in data:
            return error_response("Verification status, admin_id and location_id are required", 400)
        
        location_id = data["location_id"]
        admin_id = data["admin_id"]
        status = data["status"].lower()

        is_admin = supabase.table("admins").select("*").eq("user_id", admin_id).execute()
        if not is_admin or not hasattr(is_admin, 'data') or len(is_admin.data) ==0:
            return error_response("Denied, you do not have the necessary permission")
        
        if status not in ["verified", "unverified"]:
            return error_response("Status must be either 'verified' or 'unverified'", 400)

        # Update location_verifications
        try:
            update_response = (
                supabase.table("location_verifications")
                .update({"status": status, "verified_by": admin_id})
                .eq("location_id", location_id)
                .execute()
            )
        except Exception as e:
            return error_response(f"Failed to update verification: {str(e)}", 500)

        if not update_response.data:
            return error_response("Location verification record not found", 404)

        return success_response(update_response.data, 200)

    except Exception as e:
        return error_response(f"Unexpected error: {str(e)}", 500)


@locations_bp.route("/<int:location_id>", methods=["PUT"])
def update_location(location_id):
    try:
        data = request.json
        response = supabase.table("locations").update(data).eq("id", location_id).execute()
        if not response.data:
            return error_response("Location not found", 404)
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)

@locations_bp.route("/<int:location_id>", methods=["DELETE"])
def delete_location(location_id):
    try:
        response = supabase.table("locations").delete().eq("id", location_id).execute()
        if not response.data:
            return error_response("Location not found", 404)
        return success_response({"message": "Location deleted"})
    except Exception as e:
        return error_response(str(e), 500)
