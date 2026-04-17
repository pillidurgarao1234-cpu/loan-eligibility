"""
Authentication Routes: Register, Login, Profile
"""
import re
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.models import db, User

auth_bp = Blueprint('auth', __name__)


def validate_email(email):
    return re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email)

def validate_mobile(mobile):
    return re.match(r'^[6-9]\d{9}$', mobile)

def validate_password(password):
    return len(password) >= 6


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    mobile = data.get('mobile', '').strip()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    # Validations
    if not all([name, email, mobile, password, confirm_password]):
        return jsonify({'error': 'All fields are required'}), 400
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    if not validate_mobile(mobile):
        return jsonify({'error': 'Invalid mobile number (10 digits, starts with 6-9)'}), 400
    if not validate_password(password):
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    # Check duplicates
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409
    if User.query.filter_by(mobile=mobile).first():
        return jsonify({'error': 'Mobile number already registered'}), 409

    # Create user
    user = User(name=name, email=email, mobile=mobile)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    identifier = data.get('identifier', '').strip()  # email or mobile
    password = data.get('password', '')

    if not identifier or not password:
        return jsonify({'error': 'Email/mobile and password are required'}), 400

    # Find user by email or mobile
    user = User.query.filter_by(email=identifier.lower()).first()
    if not user:
        user = User.query.filter_by(mobile=identifier).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({'user': user.to_dict()}), 200


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    if data.get('name'):
        user.name = data['name'].strip()
    if data.get('mobile'):
        if not validate_mobile(data['mobile']):
            return jsonify({'error': 'Invalid mobile number'}), 400
        existing = User.query.filter_by(mobile=data['mobile']).first()
        if existing and existing.id != user.id:
            return jsonify({'error': 'Mobile already in use'}), 409
        user.mobile = data['mobile']

    db.session.commit()
    return jsonify({'message': 'Profile updated', 'user': user.to_dict()}), 200
