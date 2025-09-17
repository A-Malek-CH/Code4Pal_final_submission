from sqlalchemy import Column, Integer, ForeignKey, String, BigInteger
from sqlalchemy.orm import relationship
from app import db
import uuid

class UserSkills(db.Model):
    __tablename__ = 'user_skills'
    
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.BigInteger, db.ForeignKey("users.id"), nullable=False)
    skill_id = db.Column(db.String, db.ForeignKey("skills.id"), nullable=False)
    proficiency_level = db.Column(db.String(20), default='beginner')  
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relationships
    user = db.relationship("User", back_populates="skills")
    skill = db.relationship("Skill", back_populates="users")