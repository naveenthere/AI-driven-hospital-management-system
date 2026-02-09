
import sys
import os
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.chat_nlp import NLPEngine
from services.chat_rbac import is_allowed, INTENT_PERMISSIONS
from config import get_db_connection

class ChatService:
    def __init__(self):
        print("Loading NLP Engine...")
        self.nlp = NLPEngine()
        
    def process_query(self, user_id, user_role, query_text):
        """
        Process a user query through the chatbot pipeline.
        User -> NLP -> RBAC -> Data -> Response
        """
        # 1. NLP Analysis
        intent, confidence = self.nlp.predict_intent(query_text)
        entities = self.nlp.extract_entities(query_text)
        
        # 2. RBAC Enforcement
        if not is_allowed(user_role, intent):
            self.log_interaction(user_id, user_role, query_text, intent, confidence, "ACCESS_DENIED", False)
            
            # Explainable Denial
            return {
                "response": "Sorry, you do not have permission to access this information.",
                "confidence": 1.0,
                "intent": intent,
                "explanation": f"The intent '{intent}' is restricted. Your role '{user_role}' is not in the allowed list: {INTENT_PERMISSIONS.get(intent)}"
            }
            
        # 3. Data Retrieval & Response Generation
        if intent == "UNKNOWN":
            response_text = "I'm not sure I understand. Could you rephrase that? I can help with Revenue, Patients, Inventory, and Staff."
            explanation = "Low confidence in intent detection."
        else:
            response_text, explanation = self.execute_intent(intent, entities)
            
        # 4. Log Interaction
        self.log_interaction(user_id, user_role, query_text, intent, confidence, response_text, True)
        
        return {
            "response": response_text,
            "confidence": confidence,
            "intent": intent,
            "explanation": explanation
        }

    def execute_intent(self, intent, entities):
        """
        Mock executor for now. Connect to real services later.
        """
        if intent == "GET_REVENUE":
            return "$45,230 revenue generated today.", "Aggregated daily transactions from Finance Module."
            
        elif intent == "GET_PATIENT_COUNT":
            return "There are 142 active patients admitted.", "Count of active records in 'admissions' table."
            
        elif intent == "GET_UNIT_AVAILABILITY":
            return "ICU: 2 beds free. Ventilators: 4 available.", "Real-time query of 'resources' table."
            
        elif intent == "GET_STAFF_STATUS":
            return "92% staff attendance. 3 nurses on leave.", "Shift data from 'staff_attendance' table."
            
        elif intent == "GET_PATIENT_DETAILS":
            return "Patient John Doe (ID: 1023) is in Ward A, Bed 4. Condition: Stable.", "Lookup in 'medical_records' by Patient ID."
            
        return "Command executed.", "Logic placeholder."

    def log_interaction(self, user_id, user_role, query, intent, conf, response, allowed):
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            sql = """
                INSERT INTO chat_logs 
                (user_id, user_role, query_text, detected_intent, confidence_score, response_text, is_allowed)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (user_id, user_role, query, intent, conf, response, allowed))
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as e:
            print(f"Logging failed: {e}")

# Singleton instance
chat_service = ChatService()
