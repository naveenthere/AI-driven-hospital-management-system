# 🏥 Hospital Management System - Flask + MySQL

A full-stack hospital management system built with Flask (Python) backend and MySQL database, featuring a modern responsive UI.

## 📁 Project Structure

```
hospital-management/
├── backend/
│   ├── app.py              # Flask application
│   ├── db_config.py        # MySQL database configuration
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── frontend/
│   ├── templates/
│   │   └── index.html      # Main HTML template
│   └── static/
│       └── main.js         # JavaScript application logic
│
└── database/
    └── schema.sql          # MySQL database schema with seed data
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Database

1. Create a MySQL database:
```sql
CREATE DATABASE hospital_management;
```

2. Import the schema:
```bash
mysql -u root -p hospital_management < ../database/schema.sql
```

3. Configure environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update with your MySQL credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_management
```

### 3. Run the Application

```bash
python app.py
```

The application will be available at: **http://localhost:5000**

## 🔐 Default Login Credentials

| Role | User ID | Password | Access |
|------|---------|----------|--------|
| CEO | CEO001 | ceo@123 | Full Access |
| CFO | CFO001 | cfo@123 | Transactions |
| CNO | CNO001 | cno@123 | Patients, Staff |
| CMO | CMO001 | cmo@123 | Inventory |
| CCO | CCO001 | cco@123 | Certificates |
| MRM | MRM001 | mrm@123 | Medical Records |
| HR | HR001 | hr@123 | Full Access |

## 📊 Features

### 8 Main Modules

1. **Dashboard** - Real-time hospital overview with charts and statistics
2. **Patient Flow Management** - Track admissions, transfers, and discharges
3. **Staff & Resources** - Manage staff allocation and equipment
4. **Transactions & Payroll** - Financial management and employee payroll
5. **Predictions** - ML-based admission predictions and anomaly detection
6. **Blood & Organs Inventory** - Manage blood stock and organ availability
7. **Medical Records** - Patient medical records database
8. **Certificates** - Employee certificates and credentials tracking

### Key Features

- ✅ Role-based access control (RBAC)
- ✅ Real-time dashboard with interactive charts (Plotly.js)
- ✅ Responsive design (Tailwind CSS)
- ✅ Modern glassmorphism UI
- ✅ Task management system
- ✅ Search and filter functionality
- ✅ Data validation and error handling

## 🗄️ Database Schema

The system uses 11 MySQL tables:

1. `users` - User authentication and access control
2. `patients` - Patient admission and flow tracking
3. `staff` - Staff allocation and attendance
4. `equipment` - Medical equipment tracking
5. `transactions` - Financial transactions
6. `payroll` - Employee payroll records
7. `blood_stock` - Blood inventory
8. `organs` - Organ availability and waitlist
9. `certificates` - Employee certificates
10. `medical_records` - Patient medical records
11. `tasks` - User task management

## 🔧 Development

### Project Architecture

- **Backend**: Flask (Python) - RESTful API ready
- **Frontend**: Vanilla JavaScript - No framework dependencies
- **Database**: MySQL - Relational database with foreign keys
- **Styling**: Tailwind CSS (CDN) + Custom CSS
- **Charts**: Plotly.js for data visualization

### File Organization

- **HTML**: `frontend/templates/index.html` - Single page application template
- **JavaScript**: `frontend/static/main.js` - All application logic (FROZEN - do not modify)
- **Backend**: `backend/app.py` - Flask routes and API endpoints
- **Database**: `database/schema.sql` - Complete schema with seed data

## 📝 API Endpoints (Future)

The backend is prepared for API integration. Future endpoints will include:

- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add new patient
- `GET /api/staff` - Get all staff
- `GET /api/transactions` - Get transactions
- `GET /api/blood-stock` - Get blood inventory
- And more...

## ⚠️ Important Notes

### UI/JavaScript Frozen

The UI structure and JavaScript logic in `main.js` are **FROZEN** and should not be modified. Any backend integration must maintain the exact same data contracts as defined in `DATA_CONTRACT_ANALYSIS.md`.

### Data Contracts

All API responses must match the exact structure expected by the frontend. See `DATA_CONTRACT_ANALYSIS.md` for complete data contract specifications.

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
python backend/db_config.py
```

### Port Already in Use

```bash
# Change port in app.py
app.run(debug=True, host='0.0.0.0', port=5001)  # Use different port
```

### Static Files Not Loading

Make sure you're running the Flask app from the `backend/` directory:
```bash
cd backend
python app.py
```

## 📄 License

This project is for educational and demonstration purposes.

## 👥 Support

For issues or questions, please refer to the implementation plan and data contract analysis documents.

---

**Built with ❤️ using Flask, MySQL, and Modern Web Technologies**
