# models_database/appointment.py
from database import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)       # e.g. "2025-06-15"
    time = db.Column(db.String(10), nullable=False)       # e.g. "10:30"
    reason = db.Column(db.String(300), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending / confirmed / cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'doctor_id': self.doctor_id,
            'doctor_name': self.doctor.name if self.doctor else '—',
            'doctor_specialization': self.doctor.specialization if self.doctor else '—',
            'date': self.date,
            'time': self.time,
            'reason': self.reason,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M'),
        }

    def __repr__(self):
        return f'<Appointment {self.id} - {self.status}>'