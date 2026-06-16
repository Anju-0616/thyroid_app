# routes/admin_routes.py
from flask import Blueprint, request, jsonify
from database import db
from models_database.user import User
from models_database.appointment import Appointment
import jwt, os

admin_bp = Blueprint('admin', __name__)


def get_current_user(req):
    token = req.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    try:
        decoded = jwt.decode(
            token,
            os.getenv('JWT_SECRET_KEY', 'thyroid_app_secret_key'),
            algorithms=['HS256']
        )
        return User.query.get(decoded.get('user_id'))
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def require_admin(req):
    user = get_current_user(req)
    if not user:
        return None, (jsonify({'message': 'Unauthorized'}), 401)
    if not user.is_admin:
        return None, (jsonify({'message': 'Forbidden: Admin access required'}), 403)
    return user, None


@admin_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    _, err = require_admin(request)
    if err:
        return err
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    current, err = require_admin(request)
    if err:
        return err
    if current.id == user_id:
        return jsonify({'message': 'Cannot delete your own admin account'}), 400
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200


@admin_bp.route('/admin/appointments', methods=['GET'])
def get_all_appointments():
    _, err = require_admin(request)
    if err:
        return err
    appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
    result = []
    for a in appointments:
        d = a.to_dict()
        user = User.query.get(a.user_id)
        d['user_name'] = user.name if user else '—'
        d['user_email'] = user.email if user else '—'
        result.append(d)
    return jsonify(result), 200


@admin_bp.route('/admin/doctors/<int:doctor_id>/appointments', methods=['GET'])
def get_doctor_appointments(doctor_id):
    _, err = require_admin(request)
    if err:
        return err
    appointments = Appointment.query\
        .filter_by(doctor_id=doctor_id)\
        .order_by(Appointment.created_at.desc())\
        .all()
    result = []
    for a in appointments:
        d = a.to_dict()
        user = User.query.get(a.user_id)
        d['user_name']  = user.name  if user else '—'
        d['user_email'] = user.email if user else '—'
        result.append(d)
    return jsonify(result), 200