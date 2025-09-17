# app/routes/sponsorship_routes.py
from flask import Blueprint, request, jsonify
from app.controllers.sponsorship_controller import SponsorshipController
from flask_jwt_extended import jwt_required, get_jwt_identity

sponsorship_bp = Blueprint("sponsorship_bp", __name__)

@sponsorship_bp.route("/requests/<int:request_id>/sponsor", methods=["POST"])
@jwt_required()
def sponsor_request(request_id):
    user_id = get_jwt_identity()
    return jsonify(*SponsorshipController.init_sponsorship(user_id, request_id, request.json))
