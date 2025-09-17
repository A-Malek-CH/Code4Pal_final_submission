import logging
from app.models.user import User
from app import db
from app.services.location_service import LocationService

class UserService:
    @staticmethod
    def update_location(user_id, lat, lon):
        user = User.query.get(user_id)
        if not user:
            logging.warning(f"User not found with id {user_id}")
            return {"error": "User not found"}, 404

        user.latitude = str(lat)
        user.longitude = str(lon)
        user.is_in_gaza = LocationService.is_in_gaza(lat, lon)

        db.session.commit()
        logging.info(f"Updated location for user {user_id}, is_in_gaza={user.is_in_gaza}")

        return {"message": "Location updated", "is_in_gaza": user.is_in_gaza}, 200
