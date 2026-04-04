from database import db
from datetime import datetime

class ThyroidRecord(db.Model):
    __tablename__ = 'thyroid_records'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tsh = db.Column(db.Float, nullable=False)
    t3 = db.Column(db.Float, nullable=False)
    tt4 = db.Column(db.Float, nullable=False)
    result = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ThyroidRecord {self.id} - {self.result}>'