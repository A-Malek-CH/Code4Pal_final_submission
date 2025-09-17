from app.models.Requests import Request
from app.services.location_service import LocationService
from flask import abort
from . import db


class RequestService:
    @staticmethod
    def create_request(user, type, description, ip_address=None, manual_city=None):
        location_data = None
        loc_service = LocationService()

        if ip_address:
            location_data = loc_service.get_ip_location(ip_address)

        if not location_data and manual_city:
            location_data = loc_service.get_manual_location(manual_city)

        if not location_data or not location_data.get("is_in_gaza"):
            abort(403, description="only users in gaza can make requests")

        new_request = Request(
            user_id=user.id,
            type=type,
            description=description,
        )

        db.session.add(new_request)
        db.session.commit()
        return new_request