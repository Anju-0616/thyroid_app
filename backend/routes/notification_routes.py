# routes/notification_routes.py
from flask import Blueprint, request, jsonify
from database import db
from models_database.notification import Notification
import jwt, os

notification_bp = Blueprint('notification', __name__)


def get_user_id_from_token(req):
    token = req.headers.get('Authorization', '').replace('Bearer ', '')
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


def create_notification(user_id, title, message, notif_type):
    """Helper to create a notification — call this from other routes."""
    notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=notif_type
    )
    db.session.add(notif)
    db.session.commit()
    return notif


@notification_bp.route('/notifications', methods=['GET'])
def get_notifications():
    """
    Get all notifications for logged in user
    ---
    tags:
      - Notifications
    responses:
      200:
        description: List of notifications
      401:
        description: Unauthorized
    """
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    notifications = Notification.query\
        .filter_by(user_id=user_id)\
        .order_by(Notification.created_at.desc())\
        .all()

    unread_count = sum(1 for n in notifications if not n.is_read)

    return jsonify({
        'notifications': [n.to_dict() for n in notifications],
        'unread_count': unread_count
    }), 200


@notification_bp.route('/notifications/<int:notif_id>/read', methods=['POST'])
def mark_as_read(notif_id):
    """
    Mark a single notification as read
    ---
    tags:
      - Notifications
    responses:
      200:
        description: Marked as read
      404:
        description: Not found
    """
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    notif = Notification.query.filter_by(id=notif_id, user_id=user_id).first()
    if not notif:
        return jsonify({'message': 'Notification not found'}), 404

    notif.is_read = True
    db.session.commit()
    return jsonify({'message': 'Marked as read'}), 200


@notification_bp.route('/notifications/read-all', methods=['POST'])
def mark_all_read():
    """
    Mark all notifications as read
    ---
    tags:
      - Notifications
    responses:
      200:
        description: All marked as read
    """
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    Notification.query\
        .filter_by(user_id=user_id, is_read=False)\
        .update({'is_read': True})
    db.session.commit()
    return jsonify({'message': 'All notifications marked as read'}), 200


@notification_bp.route('/notifications/clear', methods=['DELETE'])
def clear_all():
    """
    Delete all notifications for user
    ---
    tags:
      - Notifications
    responses:
      200:
        description: All cleared
    """
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    Notification.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({'message': 'All notifications cleared'}), 200