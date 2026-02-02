from flask import Blueprint, jsonify, request
import sys
import os

# Add backend directory to path to import db_config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from db_config import get_db_connection

inventory_bp = Blueprint('inventory', __name__)

@inventory_bp.route('/api/inventory/blood', methods=['GET'])
def get_blood_stock():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, blood_type as type, units, donors, last_updated FROM blood_stock ORDER BY id")
        result = cursor.fetchall()
        
        # Serialize datetime objects
        for item in result:
            if item['last_updated']:
                item['last_updated'] = item['last_updated'].strftime('%Y-%m-%d %H:%M:%S')
                
        return jsonify({'success': True, 'blood_stock': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@inventory_bp.route('/api/inventory/organs', methods=['GET'])
def get_organ_stock():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, organ_type as type, available, waitlist, last_updated FROM organ_stock ORDER BY id")
        result = cursor.fetchall()
        
        # Serialize datetime objects
        for item in result:
            if item['last_updated']:
                item['last_updated'] = item['last_updated'].strftime('%Y-%m-%d %H:%M:%S')
                
        return jsonify({'success': True, 'organ_stock': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@inventory_bp.route('/api/inventory/donors', methods=['GET'])
def get_donors():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM donors ORDER BY last_donation DESC LIMIT 50")
        result = cursor.fetchall()
        for item in result:
            if item['last_donation']:
                item['last_donation'] = item['last_donation'].strftime('%Y-%m-%d')
            if item['created_at']:
                item['created_at'] = item['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        return jsonify({'success': True, 'donors': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@inventory_bp.route('/api/inventory/donate', methods=['POST'])
def add_donor():
    data = request.json
    name = data.get('name')
    contact = data.get('contact')
    address = data.get('address')
    donation_type = data.get('donation_type') # Blood or Organ
    
    # Blood specific
    blood_type = data.get('blood_type') 
    units = data.get('units', 1) 
    
    # Organ specific
    organ_type = data.get('organ_type')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Insert donor
        cursor.execute("""
            INSERT INTO donors (name, contact, address, donation_type, blood_group, organ_type, last_donation, status)
            VALUES (%s, %s, %s, %s, %s, %s, CURDATE(), 'Eligible')
        """, (name, contact, address, donation_type, blood_type, organ_type))
        
        # Update stock
        if donation_type == 'Blood':
             # Ensure blood_type is provided, if not maybe default or error? Assuming UI provides it.
             if blood_type:
                cursor.execute("""
                    UPDATE blood_stock 
                    SET units = units + %s, donors = donors + 1 
                    WHERE blood_type = %s
                """, (units, blood_type))
        elif donation_type == 'Organ':
             if organ_type:
                 cursor.execute("""
                    UPDATE organ_stock 
                    SET available = available + 1 
                    WHERE organ_type = %s
                """, (organ_type,))
            
        conn.commit()
        return jsonify({'success': True, 'message': 'Donation recorded successfully'})
    except Exception as e:
        conn.rollback()
        print(f"Error adding donor: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
@inventory_bp.route('/api/inventory/consume', methods=['POST'])
def consume_stock():
    data = request.json
    item_type = data.get('type') # 'Blood' or 'Organ'
    specific_type = data.get('specific_type') # 'A+', 'Heart', etc.
    quantity = int(data.get('quantity', 1))
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if item_type == 'Blood':
            # Check availability
            cursor.execute("SELECT units FROM blood_stock WHERE blood_type = %s", (specific_type,))
            row = cursor.fetchone()
            if not row or row[0] < quantity:
                return jsonify({'success': False, 'message': 'Insufficient blood stock'}), 400
                
            cursor.execute("UPDATE blood_stock SET units = units - %s WHERE blood_type = %s", (quantity, specific_type))
            
        elif item_type == 'Organ':
            # Check availability
            cursor.execute("SELECT available FROM organ_stock WHERE organ_type = %s", (specific_type,))
            row = cursor.fetchone()
            if not row or row[0] < quantity:
                 return jsonify({'success': False, 'message': 'Insufficient organ stock'}), 400
                 
            cursor.execute("UPDATE organ_stock SET available = available - %s WHERE organ_type = %s", (quantity, specific_type))
            
        else:
             return jsonify({'success': False, 'message': 'Invalid Type'}), 400

        conn.commit()
        return jsonify({'success': True, 'message': 'Stock consumed successfully'})
    except Exception as e:
        conn.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
