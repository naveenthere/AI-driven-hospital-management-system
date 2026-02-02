"""
Staff Management API Routes
Handles staff-related endpoints for the hospital management system
"""

from flask import Blueprint, jsonify, request
from db_config import get_db_connection

staff_bp = Blueprint('staff', __name__, url_prefix='/api')


@staff_bp.route('/staff', methods=['GET'])
def get_staff():
    """
    Get all staff members
    
    Response:
    {
        "success": true,
        "staff": [
            {
                "id": "STF001",
                "name": "Dr. Amanda Foster",
                "department": "Cardiology",
                "shift": "Day",
                "status": "Present"
            },
            ...
        ]
    }
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Query all staff - exclude role from response (used only for summary)
            query = """
                SELECT id, name, department, shift, status
                FROM staff
                ORDER BY id
            """
            cursor.execute(query)
            staff = cursor.fetchall()
            
            return jsonify({
                'success': True,
                'staff': staff
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Get staff error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500


@staff_bp.route('/staff/summary', methods=['GET'])
def get_staff_summary():
    """
    Get staff count summary by role
    
    Response:
    {
        "success": true,
        "summary": {
            "doctors": 15,
            "nurses": 45,
            "technicians": 12,
            "support": 28
        }
    }
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Count staff by role (only those Present)
            query = """
                SELECT 
                    role,
                    COUNT(*) as count
                FROM staff
                WHERE status = 'Present'
                GROUP BY role
            """
            cursor.execute(query)
            results = cursor.fetchall()
            
            # Build summary object
            summary = {
                'doctors': 0,
                'nurses': 0,
                'technicians': 0,
                'support': 0
            }
            
            for row in results:
                role = row['role'].lower()
                if role == 'doctor':
                    summary['doctors'] = row['count']
                elif role == 'nurse':
                    summary['nurses'] = row['count']
                elif role == 'technician':
                    summary['technicians'] = row['count']
                elif role == 'support':
                    summary['support'] = row['count']
            
            return jsonify({
                'success': True,
                'summary': summary
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Get staff summary error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500


@staff_bp.route('/staff/<staff_id>', methods=['PUT'])
def update_staff_status(staff_id):
    """
    Update staff status
    
    Request Body:
    {
        "status": "Present"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({
                'success': False,
                'message': 'Status is required'
            }), 400
        
        status = data['status']
        valid_statuses = ['Present', 'Leave']
        
        if status not in valid_statuses:
            return jsonify({
                'success': False,
                'message': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'
            }), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor()
            
            query = """
                UPDATE staff
                SET status = %s
                WHERE id = %s
            """
            cursor.execute(query, (status, staff_id))
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({
                    'success': False,
                    'message': 'Staff member not found'
                }), 404
            
            return jsonify({
                'success': True,
                'message': 'Staff status updated'
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Update staff error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500
