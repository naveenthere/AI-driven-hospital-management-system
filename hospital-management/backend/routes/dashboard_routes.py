from flask import Blueprint, jsonify
import sys
import os

# Add backend directory to path to import config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from config import get_db_connection

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/metrics', methods=['GET'])
def get_dashboard_metrics():
    """Compute all dashboard metrics from database"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        metrics = {}
        
        # 1. Bed Occupancy
        cursor.execute("""
            SELECT 
                COUNT(*) as total_beds,
                SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_beds
            FROM beds
        """)
        bed_data = cursor.fetchone()
        total_beds = bed_data['total_beds'] or 200
        occupied_beds = bed_data['occupied_beds'] or 0
        metrics['bed_occupancy'] = {
            'rate': round((occupied_beds / total_beds * 100), 1) if total_beds > 0 else 0,
            'occupied': occupied_beds,
            'total': total_beds
        }
        
        # 2. Patient Admissions (today)
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM patients
            WHERE DATE(admittedDate) = CURDATE()
        """)
        metrics['patient_admissions'] = cursor.fetchone()['count'] or 0
        
        # 3. Staff on Duty (present today)
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM staff
            WHERE status = 'Present'
        """)
        metrics['staff_on_duty'] = cursor.fetchone()['count'] or 0
        
        # 4. Daily P&L
        cursor.execute("""
            SELECT 
                SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as revenue,
                SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as expenses
            FROM transactions
            WHERE DATE(date) = CURDATE()
        """)
        financial = cursor.fetchone()
        revenue = float(financial['revenue'] or 0)
        expenses = float(financial['expenses'] or 0)
        metrics['daily_pl'] = {
            'profit': revenue - expenses,
            'revenue': revenue,
            'expenses': expenses
        }
        
        # 5. Emergency Waiting
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM emergency_queue
            WHERE status = 'waiting'
        """)
        metrics['emergency_waiting'] = cursor.fetchone()['count'] or 0
        
        # 6. ICU Occupancy
        cursor.execute("""
            SELECT 
                COUNT(*) as total_icu,
                SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_icu
            FROM beds
            WHERE is_icu = TRUE
        """)
        icu_data = cursor.fetchone()
        metrics['icu_occupancy'] = {
            'occupied': icu_data['occupied_icu'] or 0,
            'total': icu_data['total_icu'] or 20
        }
        
        # 7. Surgeries Scheduled (today)
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM surgeries
            WHERE scheduled_date = CURDATE()
            AND status IN ('scheduled', 'in_progress')
        """)
        metrics['surgeries_scheduled'] = cursor.fetchone()['count'] or 0
        
        # 8. Blood Stock Status (low stock count)
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM blood_stock
            WHERE units < 25
        """)
        metrics['blood_low_stock'] = cursor.fetchone()['count'] or 0
        
        # 9. Critical Patients
        cursor.execute("""
            SELECT COUNT(*) as count
            FROM patients
            WHERE status = 'critical'
        """)
        metrics['critical_patients'] = cursor.fetchone()['count'] or 0
        
        return jsonify({'success': True, 'metrics': metrics})
        
    except Exception as e:
        print(f"Error fetching dashboard metrics: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
