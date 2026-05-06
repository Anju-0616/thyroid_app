# routes/doctor_routes.py
from flask import Blueprint, request, jsonify
from database import db
from models_database.doctor import Doctor

doctor_bp = Blueprint('doctor', __name__)


@doctor_bp.route('/doctors', methods=['GET'])
def get_doctors():
    """
    Get all doctors
    ---
    tags:
      - Doctors
    responses:
      200:
        description: List of all doctors
    """
    doctors = Doctor.query.all()
    return jsonify([d.to_dict() for d in doctors]), 200


@doctor_bp.route('/doctors', methods=['POST'])
def add_doctor():
    """
    Add a new doctor (admin)
    ---
    tags:
      - Doctors
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [name, specialization, email]
          properties:
            name:
              type: string
              example: Dr. Priya Sharma
            specialization:
              type: string
              example: Endocrinologist
            email:
              type: string
              example: priya@hospital.com
            phone:
              type: string
              example: "+91-9876543210"
            location:
              type: string
              example: Apollo Hospital, Bangalore
            available_days:
              type: string
              example: Mon, Wed, Fri
    responses:
      201:
        description: Doctor added successfully
      409:
        description: Email already exists
    """
    data = request.get_json()

    name = data.get('name', '').strip()
    specialization = data.get('specialization', '').strip()
    email = data.get('email', '').strip().lower()
    phone = data.get('phone', '').strip()
    location = data.get('location', '').strip()
    available_days = data.get('available_days', '').strip()

    if not name or not specialization or not email:
        return jsonify({'message': 'Name, specialization and email are required'}), 400

    if Doctor.query.filter_by(email=email).first():
        return jsonify({'message': 'Doctor with this email already exists'}), 409

    doctor = Doctor(
        name=name,
        specialization=specialization,
        email=email,
        phone=phone,
        location=location,
        available_days=available_days
    )
    db.session.add(doctor)
    db.session.commit()

    return jsonify({'message': 'Doctor added successfully', 'doctor': doctor.to_dict()}), 201


@doctor_bp.route('/doctors/<int:doctor_id>', methods=['DELETE'])
def delete_doctor(doctor_id):
    """
    Delete a doctor (admin)
    ---
    tags:
      - Doctors
    parameters:
      - in: path
        name: doctor_id
        required: true
        type: integer
    responses:
      200:
        description: Doctor deleted
      404:
        description: Doctor not found
    """
    doctor = Doctor.query.get(doctor_id)
    if not doctor:
        return jsonify({'message': 'Doctor not found'}), 404

    db.session.delete(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor deleted successfully'}), 200