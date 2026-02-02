"""
Patients Routes for Hospital Management System
Handles patient CRUD operations
"""

from flask import Blueprint, request, jsonify
import sys
import os
from datetime import datetime

# Add parent directory to path to import db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

# Create blueprint
patients_bp = Blueprint('patients', __name__, url_prefix='/api')


def generate_next_id(conn, prefix='ADM'):
    """
    Generate next sequential ID for patients
    
    Args:
        conn: Active database connection
        prefix: ID prefix (ADM for admission, OPD for OPD)
    
    Returns:
        str: Next sequential ID (e.g., ADM001, ADM002, etc.)
    """
    try:
        if not conn:
            # Fallback to timestamp-based ID if no connection
            from time import time
            return f"{prefix}{int(time() * 1000) % 100000:05d}"
        
        cursor = conn.cursor(dictionary=True)
        
        # Get the highest existing NUMERIC ID with this prefix
        # Filter out random IDs by checking if the suffix is numeric
        if prefix == 'ADM':
            # Use REGEXP to match only ADM followed by digits
            cursor.execute("""
                SELECT id FROM patients 
                WHERE id REGEXP '^ADM[0-9]+$'
                ORDER BY CAST(SUBSTRING(id, 4) AS UNSIGNED) DESC
                LIMIT 1
            """)
            result = cursor.fetchone()
            max_id = result['id'] if result else None
        else:  # OPD
            cursor.execute("""
                SELECT opd FROM patients 
                WHERE opd REGEXP '^OPD[0-9]+$'
                ORDER BY CAST(SUBSTRING(opd, 4) AS UNSIGNED) DESC
                LIMIT 1
            """)
            result = cursor.fetchone()
            max_id = result['opd'] if result else None
        
        cursor.close()
        
        if max_id:
            # Extract number and increment
            try:
                num = int(max_id[3:]) + 1  # Skip prefix (ADM/OPD)
                return f"{prefix}{num:03d}"
            except:
                return f"{prefix}001"
        else:
            return f"{prefix}001"
    
    except Exception as e:
        print(f"Error generating ID: {e}")
        # Fallback to timestamp-based ID
        from time import time
        return f"{prefix}{int(time() * 1000) % 100000:05d}"


@patients_bp.route('/patients', methods=['GET'])
def get_patients():
    """
    Get all patients
    
    Response:
    {
        "success": true,
        "patients": [
            {
                "id": "ADM001",
                "opd": "OPD1001",
                "name": "John Smith",
                "aadhar": "1234-5678-9012",
                "bloodGroup": "O+",
                "caretaker": "Mary Smith",
                "phone": "555-0101",
                "status": "admitted",
                "admittedDate": "2024-01-15",
                "transferredDate": null,
                "dischargedDate": null,
                "department": "Cardiology",
                "doctor": "Dr. Amanda Foster",
                "nurse": "Nurse Sarah Wilson"
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
            
            # Query all patients - column names already match JS keys (camelCase)
            query = """
                SELECT id, opd, name, aadhar, bloodGroup, caretaker, phone, 
                       status, admittedDate, transferredDate, dischargedDate, 
                       department, doctor, nurse
                FROM patients
                ORDER BY admittedDate DESC
            """
            cursor.execute(query)
            patients = cursor.fetchall()
            
            # Convert dates to strings for JSON serialization
            for patient in patients:
                if patient['admittedDate']:
                    patient['admittedDate'] = patient['admittedDate'].strftime('%Y-%m-%d')
                if patient['transferredDate']:
                    patient['transferredDate'] = patient['transferredDate'].strftime('%Y-%m-%d')
                if patient['dischargedDate']:
                    patient['dischargedDate'] = patient['dischargedDate'].strftime('%Y-%m-%d')
            
            return jsonify({
                'success': True,
                'patients': patients
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Get patients error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Server error occurred'
        }), 500


@patients_bp.route('/patients', methods=['POST'])
def create_patient():
    """
    Create a new patient with auto-generated sequential IDs
    
    Expected JSON body:
    {
        "name": "John Smith",
        "aadhar": "1234-5678-9012",
        "bloodGroup": "O+",
        "caretaker": "Mary Smith",
        "phone": "555-0101",
        "status": "admitted",
        "admittedDate": "2024-01-15",
        "department": "Cardiology",
        "doctor": "Dr. Amanda Foster",
        "nurse": "Nurse Sarah Wilson"
    }
    
    Response:
    {
        "success": true,
        "patient": { ... }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        # Validate required fields (id and opd will be auto-generated)
        required_fields = ['name', 'aadhar', 'bloodGroup', 'caretaker', 
                          'phone', 'department', 'doctor', 'nurse']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Get database connection first
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            # Generate sequential IDs using the active connection
            admission_id = generate_next_id(conn, 'ADM')
            opd_id = generate_next_id(conn, 'OPD')
            
            cursor = conn.cursor(dictionary=True)
            
            # Insert new patient with auto-generated IDs
            query = """
                INSERT INTO patients 
                (id, opd, name, aadhar, bloodGroup, caretaker, phone, status, 
                 admittedDate, transferredDate, dischargedDate, department, doctor, nurse)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            values = (
                admission_id,
                opd_id,
                data['name'],
                data['aadhar'],
                data['bloodGroup'],
                data['caretaker'],
                data['phone'],
                data.get('status', 'admitted'),
                data.get('admittedDate', datetime.now().strftime('%Y-%m-%d')),
                data.get('transferredDate'),
                data.get('dischargedDate'),
                data['department'],
                data['doctor'],
                data['nurse']
            )
            
            cursor.execute(query, values)
            conn.commit()
            
            # Return the created patient with generated IDs
            created_patient = data.copy()
            created_patient['id'] = admission_id
            created_patient['opd'] = opd_id
            
            return jsonify({
                'success': True,
                'patient': created_patient,
                'message': 'Patient added successfully'
            }), 201
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Create patient error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@patients_bp.route('/patients/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """
    Update an existing patient
    
    Expected JSON body (partial updates allowed):
    {
        "transferredDate": "2024-01-20",
        "status": "transferred"
    }
    
    Response:
    {
        "success": true,
        "patient": { ... }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Build dynamic UPDATE query based on provided fields
            update_fields = []
            values = []
            
            allowed_fields = ['opd', 'name', 'aadhar', 'bloodGroup', 'caretaker', 
                            'phone', 'status', 'admittedDate', 'transferredDate', 
                            'dischargedDate', 'department', 'doctor', 'nurse']
            
            for field in allowed_fields:
                if field in data:
                    update_fields.append(f"{field} = %s")
                    values.append(data[field])
            
            if not update_fields:
                return jsonify({
                    'success': False,
                    'message': 'No valid fields to update'
                }), 400
            
            values.append(patient_id)
            
            query = f"""
                UPDATE patients 
                SET {', '.join(update_fields)}
                WHERE id = %s
            """
            
            cursor.execute(query, values)
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({
                    'success': False,
                    'message': 'Patient not found'
                }), 404
            
            # Fetch and return updated patient
            cursor.execute("""
                SELECT id, opd, name, aadhar, bloodGroup, caretaker, phone, 
                       status, admittedDate, transferredDate, dischargedDate, 
                       department, doctor, nurse
                FROM patients
                WHERE id = %s
            """, (patient_id,))
            
            patient = cursor.fetchone()
            
            # Convert dates to strings
            if patient['admittedDate']:
                patient['admittedDate'] = patient['admittedDate'].strftime('%Y-%m-%d')
            if patient['transferredDate']:
                patient['transferredDate'] = patient['transferredDate'].strftime('%Y-%m-%d')
            if patient['dischargedDate']:
                patient['dischargedDate'] = patient['dischargedDate'].strftime('%Y-%m-%d')
            
            return jsonify({
                'success': True,
                'patient': patient,
                'message': 'Patient updated successfully'
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Update patient error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@patients_bp.route('/patients/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    """
    Delete a patient
    
    Response:
    {
        "success": true,
        "message": "Patient deleted successfully"
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
            cursor = conn.cursor()
            
            query = "DELETE FROM patients WHERE id = %s"
            cursor.execute(query, (patient_id,))
            conn.commit()
            
            if cursor.rowcount == 0:
                return jsonify({
                    'success': False,
                    'message': 'Patient not found'
                }), 404
            
            return jsonify({
                'success': True,
                'message': 'Patient deleted successfully'
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Delete patient error: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
