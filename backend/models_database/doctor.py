# models_database/doctor.py
from database import db

class Doctor(db.Model):
    __tablename__ = 'doctors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    available_days = db.Column(db.String(200), nullable=True)  # e.g. "Mon, Wed, Fri"

    appointments = db.relationship('Appointment', backref='doctor', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'specialization': self.specialization,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'available_days': self.available_days,
        }

    def __repr__(self):
        return f'<Doctor {self.name}>'