# Routes package initialization
from .auth_routes import auth_bp
from .patient_flow_routes import patients_bp
from .staff_resources_routes import staff_bp, resources_bp
from .predictions_routes import predictions_bp
from .finance_routes import finance_bp
from .blood_organs_routes import inventory_bp
from .medical_records_routes import records_bp
from .dashboard_routes import dashboard_bp
from .tasks_routes import tasks_bp

__all__ = [
    'auth_bp', 
    'patients_bp', 
    'staff_bp', 
    'resources_bp', 
    'predictions_bp', 
    'finance_bp', 
    'inventory_bp', 
    'records_bp', 
    'dashboard_bp', 
    'tasks_bp'
]
