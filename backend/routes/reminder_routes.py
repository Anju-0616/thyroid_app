# routes/reminder_routes.py
from flask import Blueprint, request, jsonify
from database import db
from models_database.reminder import ReminderPreference
import jwt, os

reminder_bp = Blueprint('reminder', __name__)


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


@reminder_bp.route('/reminders/preference', methods=['GET'])
def get_preference():
    """
    Get reminder preference for logged in user
    ---
    tags:
      - Reminders
    responses:
      200:
        description: Current reminder preference
      401:
        description: Unauthorized
    """
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    pref = ReminderPreference.query.filter_by(user_id=user_id).first()
    if not pref:
        return jsonify({'frequency': 'monthly', 'is_active': False}), 200

    return jsonify(pref.to_dict()), 200


@reminder_bp.route('/reminders/preference', methods=['POST'])
def save_preference():
    """
    Save or update reminder preference
    ---
    tags:
      - Reminders
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            frequency:
              type: string
              example: monthly
            is_active:
              type: boolean
              example: true
    responses:
      200:
        description: Preference saved
      401:
        description: Unauthorized
    """
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    frequency = data.get('frequency', 'monthly')
    is_active = data.get('is_active', True)

    if frequency not in ('monthly', 'quarterly'):
        return jsonify({'message': 'Frequency must be monthly or quarterly'}), 400

    pref = ReminderPreference.query.filter_by(user_id=user_id).first()
    if pref:
        pref.frequency = frequency
        pref.is_active = is_active
    else:
        pref = ReminderPreference(
            user_id=user_id,
            frequency=frequency,
            is_active=is_active
        )
        db.session.add(pref)

    db.session.commit()
    return jsonify({'message': 'Preference saved successfully', 'preference': pref.to_dict()}), 200