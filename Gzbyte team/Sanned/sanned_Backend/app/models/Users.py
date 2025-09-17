from sqlalchemy import Column, Integer, String, Boolean, Enum, BigInteger
from flask_login import UserMixin
from sqlalchemy.orm import relationship
from . import db

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(BigInteger, primary_key=True)
    username = db.Column(String(150), unique=True, nullable=False)
    email = db.Column(String(150), unique=True, nullable=False)
    password_hash = db.Column(String(256), nullable=False)
    phone_number = db.Column(String(20), unique=True, nullable=True)
    roles = db.Column(Enum('sponsor', 'seeker_doer','both','admin', name='user_roles'), default='seeker_doer')
    localization = db.Column(String(100), nullable=True)
    latitude = db.Column(String(50), nullable=True)
    longitude = db.Column(String(50), nullable=True)
    is_in_gaza = db.Column(Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
  
skills= db.relationship('UserSkills', back_populates='user',cascade="all, delete-orphan",lazy='dynamic')