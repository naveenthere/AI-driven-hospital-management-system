from flask import Flask, render_template, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import blueprints
from routes import auth_bp, patients_bp, staff_bp, resources_bp, predictions_bp, finance_bp, inventory_bp, records_bp, dashboard_bp, tasks_bp

# Get the absolute path to the project root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Initialize Flask app with custom template and static folders
app = Flask(__name__,
            template_folder=os.path.join(BASE_DIR, 'frontend', 'templates'),
            static_folder=os.path.join(BASE_DIR, 'frontend'),
            static_url_path='')

# Enable CORS for API endpoints (if needed in future)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'
app.config['JSON_SORT_KEYS'] = False

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(patients_bp)
app.register_blueprint(staff_bp)
app.register_blueprint(resources_bp)
app.register_blueprint(predictions_bp)
app.register_blueprint(finance_bp)
app.register_blueprint(inventory_bp)
app.register_blueprint(records_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(tasks_bp)


# ============ ROUTES ============

@app.route('/')
def index():
    """Serve the main hospital management application"""
    return render_template('index.html')


@app.route('/predictions-test')
def predictions_test():
    """Test page for predictions module"""
    return render_template('predictions_test.html')

@app.route('/test_dates.html')
def test_dates():
    """Test page for date formatting"""
    return render_template('test_dates.html')


@app.route('/eda')
def eda_dashboard():
    """EDA Dashboard for Data Science analysis"""
    return render_template('eda_dashboard.html')



# ============ API ENDPOINTS (Prepared for future backend integration) ============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Hospital Management API is running'})


# Future API endpoints will be added here:
# @app.route('/api/patients', methods=['GET', 'POST'])
# @app.route('/api/staff', methods=['GET', 'POST'])
# @app.route('/api/transactions', methods=['GET', 'POST'])
# etc.


# ============ ERROR HANDLERS ============

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


# ============ RUN APPLICATION ============

if __name__ == '__main__':
    print("=" * 60)
    print("🏥 Hospital Management System - Flask Backend")
    print("=" * 60)
    print(f"📁 Template folder: {app.template_folder}")
    print(f"📁 Static folder: {app.static_folder}")
    print("🌐 Server starting on http://localhost:5000")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
