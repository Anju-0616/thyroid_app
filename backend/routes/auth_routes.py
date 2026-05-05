from flask import Blueprint, request, jsonify, current_app
from flask_mail import Mail, Message
from database import db
from models_database.user import User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, os, random, string
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

IS_DEV = os.getenv('FLASK_ENV', 'development') == 'development'


def get_mail():
    return Mail(current_app._get_current_object())


def generate_otp():
    return ''.join(random.choices(string.digits, k=6))


def send_otp_email(email, otp, name):
    mail = get_mail()
    msg = Message(
        subject='ThyroidCare — Verify your email',
        recipients=[email],
        body=f"Hi {name},\n\nYour OTP is: {otp}\n\nExpires in 10 minutes."
    )
    mail.send(msg)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [name, email, password]
          properties:
            name:
              type: string
              example: Anjali K
            email:
              type: string
              example: anjali@example.com
            password:
              type: string
              example: password123
    responses:
      201:
        description: Registered. dev_otp field visible in development mode.
      409:
        description: Email already registered.
    """
    data = request.get_json()
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'message': 'All fields are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 409

    otp = generate_otp()
    expiry = datetime.utcnow() + timedelta(minutes=10)

    new_user = User(
        name=name,
        email=email,
        password=generate_password_hash(password),
        is_verified=False,
        otp_code=otp,
        otp_expiry=expiry
    )
    db.session.add(new_user)
    db.session.commit()

    try:
        send_otp_email(email, otp, name)
    except Exception as e:
        print(f'Email error (non-fatal): {e}')

    response = {
        'message': 'Registered successfully. Check your email for the OTP.',
        'email': email
    }
    if IS_DEV:
        response['dev_otp'] = otp

    return jsonify(response), 201


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    """
    Verify email with OTP
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email, otp]
          properties:
            email:
              type: string
              example: anjali@example.com
            otp:
              type: string
              example: "482910"
    responses:
      200:
        description: Verified. Returns JWT token.
      400:
        description: Invalid or expired OTP.
    """
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    otp = data.get('otp', '').strip()

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if user.is_verified:
        return jsonify({'message': 'Already verified. Please login.'}), 200

    if not user.otp_code or not user.otp_expiry:
        return jsonify({'message': 'No OTP found. Request a new one.'}), 400

    if datetime.utcnow() > user.otp_expiry:
        return jsonify({'message': 'OTP expired. Request a new one.'}), 400

    if user.otp_code != otp:
        return jsonify({'message': 'Invalid OTP. Try again.'}), 400

    user.is_verified = True
    user.otp_code = None
    user.otp_expiry = None
    db.session.commit()

    secret_key = os.getenv('JWT_SECRET_KEY', 'thyroid_app_secret_key')
    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(days=1)},
        secret_key, algorithm='HS256'
    )

    return jsonify({
        'message': 'Email verified successfully!',
        'token': token,
        'user': {'id': user.id, 'name': user.name, 'email': user.email}
    }), 200


@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    """
    Resend OTP to email
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email]
          properties:
            email:
              type: string
              example: anjali@example.com
    responses:
      200:
        description: OTP resent. dev_otp visible in development mode.
    """
    data = request.get_json()
    email = data.get('email', '').strip().lower()

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if user.is_verified:
        return jsonify({'message': 'Already verified. Please login.'}), 200

    otp = generate_otp()
    user.otp_code = otp
    user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    try:
        send_otp_email(email, otp, user.name)
    except Exception as e:
        print(f'Resend error (non-fatal): {e}')

    response = {'message': 'OTP resent successfully.'}
    if IS_DEV:
        response['dev_otp'] = otp

    return jsonify(response), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user
    ---
    tags:
      - Auth
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [email, password]
          properties:
            email:
              type: string
              example: anjali@example.com
            password:
              type: string
              example: password123
    responses:
      200:
        description: Login successful. Returns JWT token.
      403:
        description: Email not verified.
      401:
        description: Invalid credentials.
    """
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'All fields are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401

    if not user.is_verified:
        return jsonify({
            'message': 'Email not verified. Please check your inbox.',
            'needs_verification': True,
            'email': email
        }), 403

    secret_key = os.getenv('JWT_SECRET_KEY', 'thyroid_app_secret_key')
    token = jwt.encode(
        {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(days=1)},
        secret_key, algorithm='HS256'
    )

    return jsonify({
        'token': token,
        'user': {'id': user.id, 'name': user.name, 'email': user.email}
    }), 200