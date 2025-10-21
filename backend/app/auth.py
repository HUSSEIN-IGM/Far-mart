from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db, bcrypt
from app.models import User, UserType
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("🔧 Registration attempt with data:", data)
        
        if not data:
            return jsonify({'message': 'No data provided'}), 400
        
        # Check required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'user_type']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return jsonify({'message': f'Missing required fields: {", ".join(missing_fields)}'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'message': 'User with this email already exists'}), 400
        
        # Validate user type
        if data['user_type'] not in ['farmer', 'user']:
            return jsonify({'message': 'Invalid user type. Must be "farmer" or "user"'}), 400
        
        # Create user
        user = User(
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            user_type=UserType(data['user_type']),
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=7)
        )
        
        print(f"✅ User {data['email']} registered successfully")
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Registration error: {str(e)}")
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("🔧 Login attempt for:", data.get('email'))
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            access_token = create_access_token(
                identity=user.id,
                expires_delta=timedelta(days=7)
            )
            
            print(f"✅ User {data['email']} logged in successfully")
            
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': user.to_dict()
            })
        
        print(f"❌ Login failed for {data['email']}")
        return jsonify({'message': 'Invalid email or password'}), 401
        
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@auth_bp.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Auth routes are working!'})

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        return jsonify({'user': user.to_dict()})
        
    except Exception as e:
        return jsonify({'message': 'Failed to fetch profile', 'error': str(e)}), 500