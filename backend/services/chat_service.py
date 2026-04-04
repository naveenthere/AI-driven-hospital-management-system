
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
            raw_response_text, explanation = self.execute_intent(intent, entities, query_text)
            # Use Ollama to format the raw data beautifully
            response_text = self.nlp.format_response(query_text, raw_response_text, user_role)
            
        # 4. Log Interaction
        self.log_interaction(user_id, user_role, query_text, intent, confidence, response_text, True)
        
        return {
            "response": response_text,
            "confidence": confidence,
            "intent": intent,
            "explanation": explanation
        }

    def execute_intent(self, intent, entities, query_text):
        """
        Execute the detected intent against the active MySQL database.
        """
        import re
        
        try:
            conn = get_db_connection()
            if not conn:
                return "Database connection failed.", "System error"
                
            cursor = conn.cursor(dictionary=True)
            
            if intent == "GET_REVENUE":
                cursor.execute("SELECT SUM(amount) as total FROM transactions WHERE amount > 0 AND DATE(date) = CURDATE()")
                today_rev = cursor.fetchone()['total']
                
                if today_rev:
                    response = f"Today's revenue is ${today_rev:,.2f}."
                else:
                    cursor.execute("SELECT SUM(amount) as total FROM transactions WHERE amount > 0")
                    total_rev = cursor.fetchone()['total'] or 0
                    response = f"No revenue recorded yet today. Total historical revenue is ${total_rev:,.2f}."
                
                cursor.close(); conn.close()
                return response, "Live aggregated calculation from 'transactions' table."
                
            elif intent == "GET_PATIENT_COUNT":
                cursor.execute("SELECT COUNT(*) as cnt FROM patients WHERE status IN ('admitted', 'critical')")
                count = cursor.fetchone()['cnt']
                cursor.close(); conn.close()
                return f"There are currently {count} active patients admitted.", "Live count from 'patients' table."
                
            elif intent == "GET_UNIT_AVAILABILITY":
                cursor.execute("SELECT COUNT(*) as free_icu FROM beds WHERE status != 'occupied' AND is_icu = 1")
                free_icu = cursor.fetchone()['free_icu']
                
                cursor.execute("SELECT SUM(units) as total_blood FROM blood_stock")
                blood_stock = cursor.fetchone()['total_blood'] or 0
                
                cursor.close(); conn.close()
                return f"There are {free_icu} free ICU beds available, and {blood_stock} units of blood currently in stock.", "Live aggregation across 'beds' and 'blood_stock' tables."
                
            elif intent == "GET_STAFF_STATUS":
                cursor.execute("SELECT COUNT(*) as total, SUM(CASE WHEN status='Present' THEN 1 ELSE 0 END) as present, SUM(CASE WHEN status='Leave' THEN 1 ELSE 0 END) as on_leave FROM staff")
                stats = cursor.fetchone()
                
                cursor.close(); conn.close()
                return f"Out of {stats['total']} total staff, {stats['present'] or 0} are present today and {stats['on_leave'] or 0} are on leave.", "Live state taken from 'staff' table."
                
            elif intent == "GET_PATIENT_DETAILS":
                # Fallback Regex to find ADM IDs
                id_match = re.search(r'\b(ADM\d{3,5})\b', query_text, re.IGNORECASE)
                name_match = re.search(r'patient\s+([a-zA-Z\s]+)', query_text, re.IGNORECASE)
                
                if id_match:
                    pid = id_match.group(1).upper()
                    cursor.execute("SELECT name, department, doctor, status FROM patients WHERE id = %s", (pid,))
                    patient = cursor.fetchone()
                    if patient:
                        response = f"Patient {patient['name']} ({pid}) is marked as '{patient['status']}' in the {patient['department']} department under {patient['doctor']}."
                    else:
                        response = f"I could not find a patient with ID {pid}."
                    cursor.close(); conn.close()
                    return response, "Live lookup in 'patients' table using extracted ID."
                    
                elif name_match:
                    name = name_match.group(1).strip()
                    # Skip common stopwords
                    if name.lower() in ['details', 'info', 'record', 'count']:
                         return "Please provide a specific Patient ID (e.g. ADM001).", "Needs specific ID"
                         
                    cursor.execute("SELECT id, name, department, doctor, status FROM patients WHERE name LIKE %s", (f"%{name}%",))
                    patient = cursor.fetchone()
                    if patient:
                        response = f"Patient {patient['name']} (ID: {patient['id']}) is '{patient['status']}' in {patient['department']} under {patient['doctor']}."
                    else:
                        response = f"I could not find a patient matching the name '{name}'. Try using their ID (e.g., ADM001)."
                    cursor.close(); conn.close()
                    return response, "Live lookup in 'patients' table using extracted Name."
                    
                cursor.close(); conn.close()
                return "Please specify the Patient ID (e.g., 'What is the status of ADM001?').", "Missing identifier in request."
                
        except Exception as e:
            print(f"Error executing intent {intent}: {e}")
            return "Sorry, I ran into an issue retrieving the data.", "Database error"
            
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
