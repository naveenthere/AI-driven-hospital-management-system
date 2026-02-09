
import spacy
from sentence_transformers import SentenceTransformer, util
import numpy as np

class NLPEngine:
    def __init__(self):
        # Load spaCy model for NER
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except:
            print("Warning: en_core_web_sm not found, entities extraction disabled.")
            self.nlp = None
            
        # Load Sentence Transformer for Intent Classification
        # using a small, fast model suitable for CPU
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Define Intents and their Example Utterances
        self.intent_examples = {
            "GET_REVENUE": [
                "What is the total revenue?",
                "How much money did we make today?",
                "Show me the financial report",
                "Hospital income summary",
                "Profit and loss statement"
            ],
            "GET_PATIENT_COUNT": [
                "How many patients admitted today?",
                "Total current patients",
                "Occupancy rate",
                "Number of admissions"
            ],
            "GET_UNIT_AVAILABILITY": [
                "Are there any free ICU beds?",
                "Ventilator availability",
                "Check blood stock",
                "Do we have O+ blood?",
                "Medicine stock level"
            ],
            "GET_STAFF_STATUS": [
                "Which nurses are absent?",
                "Doctor availability",
                "Staff attendance today",
                "Who is on duty?"
            ],
            "GET_PATIENT_DETAILS": [
                "Show patient record for ID 1023",
                "Find patient John Doe",
                "Medical history of admission 555"
            ]
        }
        
        # Precompute embeddings
        self.intent_embeddings = {}
        for intent, examples in self.intent_examples.items():
            self.intent_embeddings[intent] = self.model.encode(examples)

    def predict_intent(self, user_query):
        """
        Returns (intent_name, confidence_score)
        """
        query_embedding = self.model.encode(user_query)
        
        best_intent = None
        max_score = 0.0
        
        for intent, example_embeddings in self.intent_embeddings.items():
            # Calculate cosine similarity
            scores = util.cos_sim(query_embedding, example_embeddings)
            # Take the max score from the examples
            score = float(np.max(scores.numpy()))
            
            if score > max_score:
                max_score = score
                best_intent = intent
                
        # Threshold for "I don't understand"
        if max_score < 0.3:
            return "UNKNOWN", max_score
            
        return best_intent, round(max_score, 2)

    def extract_entities(self, text):
        """
        Returns dict of entities (dates, names, orgs)
        """
        if not self.nlp:
            return {}
            
        doc = self.nlp(text)
        entities = {}
        
        for ent in doc.ents:
            # Group by label
            if ent.label_ not in entities:
                entities[ent.label_] = []
            entities[ent.label_].append(ent.text)
            
        return entities
