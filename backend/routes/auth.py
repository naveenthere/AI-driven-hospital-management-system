"""
Authentication Routes for Hospital Management System
Handles user login and authentication
"""

from flask import Blueprint, request, jsonify
import json
import sys
import os

# Add parent directory to path to import db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

# Create blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/api')


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    User login endpoint
    
    Expected JSON body:
    {
        "userId": "CEO001",
        "password": "ceo@123"
    }
    
    Response on success:
    {
        "success": true,
        "user": {
            "userId": "CEO001",
            "role": "CEO",
            "name": "Dr. Sarah Johnson",
            "access": ["dashboard", "patients", ...]
        }
    }
    
    Response on failure:
    {
        "success": false,
        "message": "Invalid credentials"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        user_id = data.get('userId')
        password = data.get('password')
        
        # Validate input
        if not user_id or not password:
            return jsonify({
                'success': False,
                'message': 'Please fill in all fields'
            }), 400
        
        # Connect to database
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Query user from database
            query = """
                SELECT userId, password, role, name, access 
                FROM users 
                WHERE userId = %s
            """
            cursor.execute(query, (user_id,))
            user = cursor.fetchone()
            
            # Check if user exists and password matches
            if user and user['password'] == password:
                # Parse JSON access array
                access_list = json.loads(user['access']) if isinstance(user['access'], str) else user['access']
                
                # Return user data (excluding password)
                return jsonify({
                    'success': True,
                    'user': {
                        'userId': user['userId'],
                        'role': user['role'],
                        'name': user['name'],
                        'access': access_list
                    }
                }), 200
            else:
                # Invalid credentials
                return jsonify({
                    'success': False,
                    'message': 'Invalid credentials'
                }), 401
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    User logout endpoint (for future session management)
    Currently just returns success
    """
    return jsonify({
        'success': True,
        'message': 'Logged out successfully'
    }), 200
