from sqlalchemy import  Column, Integer,String,ForeignKey,Enum
from . import db 
from datetime import datetime
class Request(db.Model):
    __tablename__='requests'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type = db.Column(db.Enum("donation", "exchange", "service", name="request_types"), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum("pending", "approved", "rejected", "completed", name="request_statuses"), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

   
    user = db.relationship("User", back_populates="requests")
    matches = db.relationship("Match", back_populates="request", cascade="all, delete-orphan")