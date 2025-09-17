import os
from dotenv import load_dotenv
from datetime import timedelta
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY must be set in environment variables")

    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("DATABASE_URL must be set in environment variables")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY must be set in environment variables")

    ABSTRACT_API_KEY = os.getenv("ABSTRACT_API_KEY")  
    # ABSTRACT_API_KEY is optional for development
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)
