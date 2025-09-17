from sqlalchemy import Column, Integer, String, BigInteger
from sqlalchemy.orm import relationship
from app import db
import uuid

class Skill(db.Model):
    __tablename__ = 'skills'
    
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    users = db.relationship('UserSkills', back_populates='skill', cascade="all, delete-orphan")