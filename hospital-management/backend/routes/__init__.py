# Routes package initialization
from .auth import auth_bp
from .patients import patients_bp
from .staff import staff_bp
from .resources import resources_bp
from .predictions import predictions_bp
from .finance import finance_bp
from .inventory import inventory_bp
from .records import records_bp
from .dashboard import dashboard_bp
from .tasks import tasks_bp

__all__ = ['auth_bp', 'patients_bp', 'staff_bp', 'resources_bp', 'predictions_bp', 'finance_bp', 'inventory_bp', 'records_bp', 'dashboard_bp', 'tasks_bp']
