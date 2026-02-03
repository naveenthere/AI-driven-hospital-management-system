"""
Finance API Routes
Handles transactions, payroll, and financial summary endpoints
"""

from flask import Blueprint, jsonify, request
from datetime import datetime
import sys
import os

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import get_db_connection

finance_bp = Blueprint('finance', __name__)


@finance_bp.route('/api/finance/summary', methods=['GET'])
def get_finance_summary():
    """
    Get financial summary (total revenue, expenses, profit/loss)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Calculate total revenue (positive amounts)
        cursor.execute("""
            SELECT SUM(amount) as total_revenue
            FROM transactions
            WHERE amount > 0
        """)
        revenue_result = cursor.fetchone()
        total_revenue = float(revenue_result['total_revenue'] or 0)
        
        # Calculate total expenses (negative amounts, convert to positive)
        cursor.execute("""
            SELECT SUM(ABS(amount)) as total_expenses
            FROM transactions
            WHERE amount < 0
        """)
        expense_result = cursor.fetchone()
        total_expenses = float(expense_result['total_expenses'] or 0)
        
        # Calculate net profit/loss
        net_profit = total_revenue - total_expenses
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'total_revenue': total_revenue,
            'total_expenses': total_expenses,
            'net_profit': net_profit
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@finance_bp.route('/api/finance/transactions', methods=['GET'])
def get_transactions():
    """
    Get recent transactions
    Query params: limit (default: 20)
    """
    try:
        limit = request.args.get('limit', 20, type=int)
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, date, type, description, amount, created_at
            FROM transactions
            ORDER BY date DESC, created_at DESC
            LIMIT %s
        """, (limit,))
        
        transactions = cursor.fetchall()
        
        # Convert date objects to strings
        for txn in transactions:
            if txn['date']:
                txn['date'] = txn['date'].strftime('%Y-%m-%d')
            if txn['created_at']:
                txn['created_at'] = txn['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'transactions': transactions
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@finance_bp.route('/api/finance/transactions', methods=['POST'])
def add_transaction():
    """
    Add a new transaction
    Body: {
        "transaction_type": "Revenue" | "Expense",
        "category": "Equipment" | "Medicine" | "Revenue" | "Payroll" | "Other",
        "description": "string",
        "amount": number,
        "transaction_date": "YYYY-MM-DD" (optional, defaults to today)
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['transaction_type', 'category', 'description', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # Generate transaction ID
        txn_id = f"TXN{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Get transaction date (default to today)
        txn_date = data.get('transaction_date', datetime.now().strftime('%Y-%m-%d'))
        
        # Ensure amount is negative for expenses
        amount = float(data['amount'])
        if data['transaction_type'] == 'Expense' and amount > 0:
            amount = -amount
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO transactions (id, date, type, description, amount)
            VALUES (%s, %s, %s, %s, %s)
        """, (txn_id, txn_date, data['category'], data['description'], amount))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'transaction_id': txn_id,
            'message': 'Transaction added successfully'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@finance_bp.route('/api/finance/payroll', methods=['GET'])
def get_payroll():
    """
    Get payroll records grouped by category
    Query params: month, year (defaults to current month/year)
    """
    try:
        # Get month and year from query params or use current
        month = request.args.get('month', datetime.now().month, type=int)
        year = request.args.get('year', datetime.now().year, type=int)
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute("""
            SELECT id, employee_id, employee_name, category, role,
                   base_salary, bonus, deductions, net_salary,
                   processed, processed_at
            FROM payroll_records
            WHERE period_month = %s AND period_year = %s
            ORDER BY category, employee_name
        """, (month, year))
        
        all_records = cursor.fetchall()
        
        # Group by category
        payroll = {
            'doctors': [],
            'nurses': [],
            'management': [],
            'technicians': [],
            'others': []
        }
        
        for record in all_records:
            category = record['category']
            if category in payroll:
                # Convert processed_at to string if exists
                if record['processed_at']:
                    record['processed_at'] = record['processed_at'].strftime('%Y-%m-%d %H:%M:%S')
                payroll[category].append(record)
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'month': month,
            'year': year,
            'payroll': payroll
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@finance_bp.route('/api/finance/process-payroll', methods=['POST'])
def process_payroll():
    """
    Process payroll for a given period
    Creates a transaction for total payroll amount
    Body: {
        "month": number,
        "year": number
    }
    """
    try:
        data = request.get_json()
        month = data.get('month', datetime.now().month)
        year = data.get('year', datetime.now().year)
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Calculate total payroll amount
        cursor.execute("""
            SELECT SUM(net_salary) as total_amount
            FROM payroll_records
            WHERE period_month = %s AND period_year = %s AND processed = FALSE
        """, (month, year))
        
        result = cursor.fetchone()
        total_amount = float(result['total_amount'] or 0)
        
        if total_amount == 0:
            cursor.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'No unprocessed payroll records found for this period'
            }), 400
        
        # Create transaction for payroll
        txn_id = f"TXN{datetime.now().strftime('%Y%m%d%H%M%S')}"
        txn_date = datetime.now().strftime('%Y-%m-%d')
        description = f"Payroll Processing - {month}/{year}"
        
        cursor.execute("""
            INSERT INTO transactions (id, date, type, description, amount)
            VALUES (%s, %s, 'Payroll', %s, %s)
        """, (txn_id, txn_date, description, -total_amount))
        
        # Mark payroll records as processed
        cursor.execute("""
            UPDATE payroll_records
            SET processed = TRUE, processed_at = NOW()
            WHERE period_month = %s AND period_year = %s AND processed = FALSE
        """, (month, year))
        
        # Add to payroll history
        cursor.execute("""
            INSERT INTO payroll_history (period_month, period_year, total_amount, transaction_id, processed_by)
            VALUES (%s, %s, %s, %s, 'SYSTEM')
        """, (month, year, total_amount, txn_id))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'total_processed': total_amount,
            'transaction_id': txn_id,
            'message': f'Payroll processed successfully for {month}/{year}'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
