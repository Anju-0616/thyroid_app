# models_database/reminder.py
from database import db
from datetime import datetime

class ReminderPreference(db.Model):
    __tablename__ = 'reminder_preferences'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    frequency = db.Column(db.String(20), nullable=False, default='monthly')  # monthly / quarterly
    is_active = db.Column(db.Boolean, default=True)
    last_sent = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('reminder_preference', uselist=False))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'frequency': self.frequency,
            'is_active': self.is_active,
            'last_sent': self.last_sent.strftime('%Y-%m-%d %H:%M') if self.last_sent else None,
        }

    def __repr__(self):
        return f'<ReminderPreference user={self.user_id} freq={self.frequency}>'