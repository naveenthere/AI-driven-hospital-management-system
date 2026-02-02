"""
Resources Management API Routes
Handles bed and equipment resource endpoints
"""

from flask import Blueprint, jsonify, request
from db_config import get_db_connection

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
                    if hasattr(date_obj, 'strftime'):
                        eq['lastService'] = date_obj.strftime('%Y-%m-%d')
                    else:
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
