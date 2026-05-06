# routes/appointment_routes.py
from flask import Blueprint, request, jsonify, current_app
from flask_mail import Mail, Message
from database import db
from models_database.appointment import Appointment
from models_database.doctor import Doctor
from models_database.user import User
from routes.notification_routes import create_notification
import jwt, os

appointment_bp = Blueprint('appointment', __name__)


def get_user_id_from_token(request):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    try:
        decoded = jwt.decode(
            token,
            os.getenv('JWT_SECRET_KEY', 'thyroid_app_secret_key'),
            algorithms=['HS256']
        )
        return decoded.get('user_id')
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def send_confirmation_email(user, doctor, appointment):
    try:
        mail = Mail(current_app._get_current_object())
        msg = Message(
            subject='ThyroidCare — Appointment Confirmed',
            recipients=[user.email],
            body=(
                f"Hi {user.name},\n\n"
                f"Your appointment has been booked successfully!\n\n"
                f"Doctor   : {doctor.name}\n"
                f"Specialty: {doctor.specialization}\n"
                f"Date     : {appointment.date}\n"
                f"Time     : {appointment.time}\n"
                f"Reason   : {appointment.reason or 'Not specified'}\n\n"
                f"Please arrive 10 minutes early.\n\n"
                f"— ThyroidCare Team"
            )
        )
        mail.send(msg)
    except Exception as e:
        print(f'Confirmation email error (non-fatal): {e}')


@appointment_bp.route('/appointments', methods=['POST'])
def book_appointment():
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    doctor_id = data.get('doctor_id')
    date = data.get('date', '').strip()
    time = data.get('time', '').strip()
    reason = data.get('reason', '').strip()

    if not doctor_id or not date or not time:
        return jsonify({'message': 'Doctor, date and time are required'}), 400

    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({'message': 'Doctor not found'}), 404

    user = User.query.get(user_id)

    appointment = Appointment(
        user_id=user_id,
        doctor_id=doctor_id,
        date=date,
        time=time,
        reason=reason,
        status='confirmed'
    )
    db.session.add(appointment)
    db.session.commit()

    send_confirmation_email(user, doctor, appointment)

    # ── Notification ──────────────────────────────────────
    create_notification(
        user_id=user_id,
        title='📅 Appointment Confirmed',
        message=f'Your appointment with {doctor.name} is confirmed for {date} at {time}.',
        notif_type='appointment'
    )

    return jsonify({
        'message': 'Appointment booked successfully!',
        'appointment': appointment.to_dict()
    }), 201


@appointment_bp.route('/appointments', methods=['GET'])
def get_appointments():
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    appointments = Appointment.query\
        .filter_by(user_id=user_id)\
        .order_by(Appointment.created_at.desc())\
        .all()

    return jsonify([a.to_dict() for a in appointments]), 200