
from flask import Blueprint, request, jsonify
from services.chat_service import chat_service

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

@chat_bp.route('/query', methods=['POST'])
def chat_query():
    """
    Chatbot Query Endpoint
    
    Request:
    {
        "userId": "CEO001",
        "role": "CEO",
        "query": "Show me revenue"
    }
    """
    try:
        data = request.json
        if not data or 'query' not in data:
            return jsonify({'success': False, 'message': 'Missing query'}), 400
            
        user_id = data.get('userId', 'anonymous')
        user_role = data.get('role', 'GUEST')
        query_text = data.get('query')
        
        # Process via ChatService
        result = chat_service.process_query(user_id, user_role, query_text)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({
            'success': False, 
            'message': 'Internal AI Error'
        }), 500
