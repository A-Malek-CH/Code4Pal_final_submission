# app/services/security_service.py
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from app.config import JWT_ACCESS_TOKEN_EXPIRES
import logging

logging.basicConfig(level=logging.INFO)
bcrypt = Bcrypt()

class SecurityService:
    @staticmethod
    def hash_password(password):
        hashed = bcrypt.generate_password_hash(password).decode('utf-8')
        logging.info("Password hashed successfully")
        return hashed

    @staticmethod
    def check_password(hashed_password, password):
        result = bcrypt.check_password_hash(hashed_password, password)
        logging.info(f"Password check: {'successful' if result else 'failed'}")
        return result

    @staticmethod
    def generate_token(user_id, expires_delta=None):
        if expires_delta is None:
            expires_delta = JWT_ACCESS_TOKEN_EXPIRES
            logging.info(f"Using default JWT access token expiry: {expires_delta}")
        token = create_access_token(identity=user_id, expires_delta=expires_delta)
        logging.info(f"JWT token generated for user_id: {user_id}")
        return token