from flask import Blueprint, request
from api.DB.connection import supabase
from api.routes import success_response, error_response

emergencies_bp = Blueprint("emergencies", __name__)

@emergencies_bp.route("", methods=["GET"])
def list_emergencies():
    try:
        response = supabase.table("emergencies").select("*").execute()
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)

@emergencies_bp.route("/<int:emergency_id>", methods=["GET"])
def get_emergency(emergency_id):
    try:
        response = supabase.table("emergencies").select("*").eq("id", emergency_id).single().execute()
        if not response.data:
            return error_response("Emergency not found", 404)
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)

@emergencies_bp.route("", methods=["POST"])
def create_emergency():
    try:
        data = request.json
        response = supabase.table("emergencies").insert(data).execute()
        return success_response(response.data, 201)
    except Exception as e:
        return error_response(str(e), 500)

@emergencies_bp.route("/<int:emergency_id>", methods=["PUT"])
def update_emergency(emergency_id):
    try:
        data = request.json
        response = supabase.table("emergencies").update(data).eq("id", emergency_id).execute()
        if not response.data:
            return error_response("Emergency not found", 404)
        return success_response(response.data)
    except Exception as e:
        return error_response(str(e), 500)

@emergencies_bp.route("/<int:emergency_id>", methods=["DELETE"])
def delete_emergency(emergency_id):
    try:
        response = supabase.table("emergencies").delete().eq("id", emergency_id).execute()
        if not response.data:
            return error_response("Emergency not found", 404)
        return success_response({"message": "Emergency deleted"})
    except Exception as e:
        return error_response(str(e), 500)
