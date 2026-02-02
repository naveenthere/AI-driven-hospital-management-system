from flask import Blueprint, jsonify, request
import sys
import os

# Add backend directory to path to import db_config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db_config import get_db_connection

records_bp = Blueprint('records', __name__)

@records_bp.route('/api/records', methods=['GET'])
def get_records():
    """Get all medical records"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT 
                id,
                patient_id as patientId,
                patient_name as name,
                diagnosis,
                treatment,
                doctor,
                last_visit as lastVisit
            FROM medical_records 
            ORDER BY last_visit DESC
        """)
        result = cursor.fetchall()
        
        # Serialize date objects
        for item in result:
            if item['lastVisit']:
                item['lastVisit'] = item['lastVisit'].strftime('%Y-%m-%d')
                
        return jsonify({'success': True, 'records': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@records_bp.route('/api/records', methods=['POST'])
def add_record():
    """Add or update a medical record"""
    data = request.json
    record_id = data.get('id')
    patient_id = data.get('patientId')
    patient_name = data.get('name')
    diagnosis = data.get('diagnosis')
    treatment = data.get('treatment')
    doctor = data.get('doctor')
    last_visit = data.get('lastVisit')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Use INSERT...ON DUPLICATE KEY UPDATE with new MySQL 8.0.20+ syntax
        cursor.execute("""
            INSERT INTO medical_records 
            (id, patient_id, patient_name, diagnosis, treatment, doctor, last_visit)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                patient_id = %s,
                patient_name = %s,
                diagnosis = %s,
                treatment = %s,
                doctor = %s,
                last_visit = %s
        """, (record_id, patient_id, patient_name, diagnosis, treatment, doctor, last_visit,
              patient_id, patient_name, diagnosis, treatment, doctor, last_visit))
        
        conn.commit()
        return jsonify({'success': True, 'message': 'Record saved successfully'})
    except Exception as e:
        conn.rollback()
        print(f"Error saving record: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

