"""
Staff Management API Routes
Handles staff-related endpoints for the hospital management system
"""

from flask import Blueprint, jsonify, request
from config import get_db_connection

staff_bp = Blueprint('staff', __name__, url_prefix='/api')


@staff_bp.route('/staff', methods=['GET'])
def get_staff():
    """
    Get all staff members
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
            
            # Query all staff
            query = """
                SELECT id, name, department, shift, status, role
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
    """
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({
                'success': False,
                'message': 'Status is required'
            }), 400
        
        status = data['status']
        valid_statuses = ['Present', 'Leave', 'On Duty', 'Off Duty']
        
        # Loose validation to allow flexible statuses if needed
        
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

@staff_bp.route('/staff', methods=['POST'])
def add_staff():
    """
    Add new staff member
    """
    try:
        data = request.get_json()
        required = ['name', 'department', 'role']
        for f in required:
            if not data.get(f):
             return jsonify({'success': False, 'message': f'Missing {f}'}), 400
             
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Generate ID (Simplified)
        cursor.execute("SELECT id FROM staff ORDER BY id DESC LIMIT 1")
        last = cursor.fetchone()
        new_id = "STF001"
        if last:
             # Logic to increment STFXXX
             try:
                 num = int(last[0][3:]) + 1
                 new_id = f"STF{num:03d}"
             except:
                 import time
                 new_id = f"STF{int(time.time())}"

        cursor.execute("""
            INSERT INTO staff (id, name, department, role, shift, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (new_id, data['name'], data['department'], data['role'], data.get('shift', 'Day'), 'Present'))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Staff added', 'id': new_id})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@staff_bp.route('/staff/<staff_id>', methods=['DELETE'])
def delete_staff(staff_id):
    """
    Delete staff member
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM staff WHERE id = %s", (staff_id,))
        conn.commit()
        if cursor.rowcount == 0:
             return jsonify({'success': False, 'message': 'Not found'}), 404
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'Staff deleted'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# ==========================================
# RESOURCES ROUTES (Merged from resources.py)
# ==========================================

resources_bp = Blueprint('resources', __name__, url_prefix='/api/resources')


@resources_bp.route('/beds', methods=['GET'])
def get_beds():
    """
    Get bed status for all wards
    
    Response:
    {
        "success": true,
        "beds": [
            {
                "ward_type": "General Ward",
                "total_beds": 50,
                "occupied_beds": 38
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
            
            query = """
                SELECT 
                    CASE 
                        WHEN is_icu = 1 THEN 'ICU'
                        WHEN department = 'Pediatrics' THEN 'Pediatric'
                        ELSE 'General Ward'
                    END as ward_type,
                    COUNT(*) as total_beds,
                    SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_beds
                FROM beds
                GROUP BY 
                    CASE 
                        WHEN is_icu = 1 THEN 'ICU'
                        WHEN department = 'Pediatrics' THEN 'Pediatric'
                        ELSE 'General Ward'
                    END
                ORDER BY 
                    CASE ward_type
                        WHEN 'General Ward' THEN 1
                        WHEN 'ICU' THEN 2
                        WHEN 'Pediatric' THEN 3
                    END
            """
            cursor.execute(query)
            beds = cursor.fetchall()
            
            return jsonify({
                'success': True,
                'beds': beds
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Get beds error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500


@resources_bp.route('/equipment', methods=['GET'])
def get_equipment():
    """
    Get all equipment
    
    Response:
    {
        "success": true,
        "equipment": [
            {
                "id": "EQ001",
                "name": "MRI Scanner",
                "department": "Radiology",
                "status": "In Use",
                "lastService": "2024-01-01"
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
            
            query = """
                SELECT id, name, department, status, last_service
                FROM equipment
                ORDER BY id
            """
            cursor.execute(query)
            equipment_list = cursor.fetchall()
            
            # Convert last_service to lastService (camelCase) and format date
            for eq in equipment_list:
                if eq['last_service']:
                    # Handle both date and datetime objects
                    date_obj = eq['last_service']
                    try:
                        if hasattr(date_obj, 'strftime'):
                            eq['lastService'] = date_obj.strftime('%Y-%m-%d')
                        else:
                            eq['lastService'] = str(date_obj)
                    except:
                        eq['lastService'] = str(date_obj)
                else:
                    eq['lastService'] = None
                del eq['last_service']  # Remove snake_case key
            
            return jsonify({
                'success': True,
                'equipment': equipment_list
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Get equipment error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500


@resources_bp.route('/equipment/<equipment_id>', methods=['PUT'])
def update_equipment(equipment_id):
    """
    Update equipment status
    
    Request Body:
    {
        "status": "Under Repair"
    }
    
    Response:
    {
        "success": true,
        "message": "Equipment status updated"
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
        valid_statuses = ['In Use', 'Under Repair', 'To Purchase']
        
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
            
            # Update equipment status
            query = """
                UPDATE equipment
                SET status = %s
                WHERE id = %s
            """
            cursor.execute(query, (status, equipment_id))
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({
                    'success': False,
                    'message': 'Equipment not found'
                }), 404
            
            return jsonify({
                'success': True,
                'message': 'Equipment status updated'
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Update equipment error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500
