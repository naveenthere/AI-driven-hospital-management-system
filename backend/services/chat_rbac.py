
# Role-Based Access Control for Chatbot

# User Roles
ROLE_CEO = "CEO"
ROLE_CFO = "CFO"
ROLE_CNO = "CNO"  # Chief Nursing Officer
ROLE_CMO = "CMO"  # Chief Medical Officer
ROLE_PRM = "PRM"  # Patient Record Manager
ROLE_HR = "HR"

# Intent-Role Mapping
# Defines which roles are allowed to access which intents
INTENT_PERMISSIONS = {
    "GET_REVENUE": [ROLE_CEO, ROLE_CFO, ROLE_HR],
    "GET_PATIENT_COUNT": [ROLE_CEO, ROLE_CNO, ROLE_PRM],
    "GET_UNIT_AVAILABILITY": [ROLE_CMO, ROLE_CNO, ROLE_CEO],
    "GET_STAFF_STATUS": [ROLE_CNO, ROLE_HR, ROLE_CEO],
    "GET_PATIENT_DETAILS": [ROLE_PRM, ROLE_CNO]  # Strictly limited
}

def is_allowed(user_role, intent):
    """
    Check if a role is permitted to execute an intent.
    UNKNOWN intents are generally allowed (or handled as fallback).
    """
    if intent == "UNKNOWN":
        return True
        
    allowed_roles = INTENT_PERMISSIONS.get(intent, [])
    return user_role in allowed_roles
