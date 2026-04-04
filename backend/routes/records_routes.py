from flask import Blueprint, request, jsonify
from database import db
from models_database.thyroid_record import ThyroidRecord
import jwt
import os

records_bp = Blueprint('records', __name__)

def get_user_id_from_token(request):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return None
    try:
        decoded = jwt.decode(token, os.getenv('JWT_SECRET_KEY') or 'thyroid_app_secret_key', algorithms=['HS256'])
        return decoded.get('user_id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


@records_bp.route('/records', methods=['POST'])
def save_record():
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    tsh = data.get('tsh')
    t3 = data.get('t3')
    tt4 = data.get('tt4')
    result = data.get('result')

    if not all([tsh, t3, tt4, result]):
        return jsonify({'message': 'All fields are required'}), 400

    record = ThyroidRecord(
        user_id=user_id,
        tsh=tsh,
        t3=t3,
        tt4=tt4,
        result=result
    )
    db.session.add(record)
    db.session.commit()

    return jsonify({'message': 'Record saved successfully'}), 201


@records_bp.route('/records', methods=['GET'])
def get_records():
    user_id = get_user_id_from_token(request)
    if not user_id:
        return jsonify({'message': 'Unauthorized'}), 401

    records = ThyroidRecord.query.filter_by(user_id=user_id).order_by(ThyroidRecord.created_at.desc()).all()

    result = []
    for r in records:
        result.append({
            'id': r.id,
            'tsh': r.tsh,
            't3': r.t3,
            'tt4': r.tt4,
            'result': r.result,
            'created_at': r.created_at.strftime('%Y-%m-%d %H:%M')
        })

    return jsonify(result), 200