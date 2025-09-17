from sqlalchemy import  Column, Integer,String,ForeignKey,Enum
from . import db 
from datetime import datetime
from sqlalchemy.orm import relationship
class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)
    request_a_id = db.Column(db.Integer, db.ForeignKey("requests.id"), nullable=False)
    request_b_id = db.Column(db.Integer, db.ForeignKey("requests.id"), nullable=False)
    status = db.Column(db.Enum("pending", "confirmed", "cancelled", name="match_statuses"), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

  
    request_a = db.relationship("Request", foreign_keys=[request_a_id], backref="matches_as_a")
    request_b = db.relationship("Request", foreign_keys=[request_b_id], backref="matches_as_b")

    def __repr__(self):
        return f"<Match {self.request_a_id} ↔ {self.request_b_id} | {self.status}>"
