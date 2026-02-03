from flask import Blueprint, jsonify, request
from config import get_db_connection
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

@tasks_bp.route('', methods=['GET'])
def get_tasks():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
        tasks = cursor.fetchall()
        
        # Format dates
        for task in tasks:
            if task['due_date']:
                task['dueDate'] = task['due_date'].strftime('%Y-%m-%d')
                del task['due_date']
            if task['created_at']:
                task['created_at'] = task['created_at'].strftime('%Y-%m-%d %H:%M:%S')
            # Ensure boolean
            task['completed'] = bool(task['completed'])
            
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'tasks': tasks})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@tasks_bp.route('', methods=['POST'])
def add_task():
    try:
        data = request.get_json()
        description = data.get('description')
        due_date = data.get('dueDate')
        priority = data.get('priority', 'low')
        
        if not description:
            return jsonify({'success': False, 'message': 'Description is required'}), 400
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO tasks (description, due_date, priority) VALUES (%s, %s, %s)",
            (description, due_date, priority)
        )
        conn.commit()
        task_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Task added', 'id': task_id})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
        conn.commit()
        
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({'success': False, 'message': 'Task not found'}), 404
            
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Task deleted'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@tasks_bp.route('/<int:task_id>/toggle', methods=['PUT'])
def toggle_task(task_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Toggle boolean value
        cursor.execute("UPDATE tasks SET completed = NOT completed WHERE id = %s", (task_id,))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Task status updated'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
