# app/services/username_service.py
import random
from app.models import User
from app import db
import logging

logging.basicConfig(level=logging.INFO)

class UsernameService:
    @staticmethod
    def generate_unique_username(email):
        base = email.lower().split('@')[0][:20]
        while True:
            username = f"{base}{random.randint(1000, 9999)}"
            if not User.query.filter_by(username=username).first():
                logging.info(f"Generated unique username: {username}")
                return username
            logging.debug(f"Username {username} already exists, trying another")

    @staticmethod
    def update_username(user_id, new_username):
        if not new_username or len(new_username) < 3 or len(new_username) > 50:
            raise ValueError("Username must be between 3 and 50 characters")
        if User.query.filter_by(username=new_username).first():
            raise ValueError("Username already exists")
        user = User.query.get_or_404(user_id)
        user.username = new_username
        db.session.commit()
        logging.info(f"Username updated for user_id {user_id}: {new_username}")
        return user.username