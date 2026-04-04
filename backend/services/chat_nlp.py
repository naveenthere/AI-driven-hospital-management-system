import json
import requests
import re

class NLPEngine:
    def __init__(self, model_name="llama3.2"):
        self.ollama_url = "http://localhost:11434/api/generate"
        self.model_name = model_name
        self.intents = [
            "GET_REVENUE", "GET_PATIENT_COUNT", "GET_UNIT_AVAILABILITY", 
            "GET_STAFF_STATUS", "GET_PATIENT_DETAILS", "UNKNOWN"
        ]

    def _call_ollama(self, prompt, timeout=90):
        try:
            payload = {
                "model": self.model_name,
                "prompt": prompt,
                "stream": False
            }
            response = requests.post(self.ollama_url, json=payload, timeout=timeout)
            if response.status_code == 200:
                return response.json().get('response', '').strip()
            return None
        except requests.exceptions.RequestException as e:
            print(f"Ollama API not reachable: {e}")
            return None

    def predict_intent(self, user_query):
        """
        Send a zero-shot classification prompt to Ollama.
        """
        prompt = f"""
        You are an intelligent NLP router for a hospital management system.
        Analyze the following user query and classify it into EXACTLY ONE of these intents:
        {', '.join(self.intents)}

        Rules:
        - Output ONLY the exact intent name in uppercase. Do not say "The intent is..."
        - If the user asks about revenue, money, or profit: GET_REVENUE
        - If the user asks about patient counts or admitted totals: GET_PATIENT_COUNT
        - If the user asks about free beds, ICU, ventilators, or blood stock: GET_UNIT_AVAILABILITY
        - If the user asks about who is absent, nurse schedules, or staff status: GET_STAFF_STATUS
        - If the user asks about a specific patient's details, name, or ID: GET_PATIENT_DETAILS
        - If the query makes absolutely no sense in a hospital context: UNKNOWN

        User query: "{user_query}"
        Intent:"""
        
        response = self._call_ollama(prompt)
        
        # Fallback if Ollama is down
        if not response:
            return "UNKNOWN", 0.0
            
        detected_intent = "UNKNOWN"
        # Sanitize response in case Ollama was chatty
        for intent in self.intents:
            if intent in response.upper():
                detected_intent = intent
                break
                
        # Fake confidence score backward compatibility
        return detected_intent, 0.95

    def extract_entities(self, text):
        """
        Stub out legacy spaCy logic. Relying on Regex in the service layer for strict IDs.
        """
        return {}

    def format_response(self, query, raw_data, user_role):
        """
        Retrieval-Augmented Generation (RAG):
        Take raw SQL data and ask Ollama to make it sound human.
        """
        prompt = f"""
        You are a highly professional, helpful AI Assistant embedded inside a Hospital Management Dashboard.
        The user (Role: {user_role}) asked you this question: "{query}"
        
        We have automatically executed a secure database query and retrieved this raw data to answer them:
        {raw_data}
        
        Draft a polite, concise, natural-sounding response to the user incorporating this data automatically.
        Do NOT explain the SQL query, do NOT say "Based on the raw data", and do NOT make up any numbers.
        Just answer them directly.
        """
        response = self._call_ollama(prompt, timeout=90)
        
        # Fallback to the raw string if the LLM crashes or times out
        if not response:
            return f"{raw_data} (Note: Offline mode. Install Ollama to generate natural language replies!)"
            
        return response
