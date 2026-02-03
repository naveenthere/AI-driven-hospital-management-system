# MedCare AI - Hospital Management System 🏥

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
![Flask](https://img.shields.io/badge/flask-3.0-green)
![Status](https://img.shields.io/badge/status-active-success)

**MedCare AI** is a comprehensive, AI-driven Hospital Management System designed to modernize healthcare administration. It leverages machine learning (SARIMA/ARIMA) to predict patient admissions, optimize staff allocation, and manage critical resources like blood and organs.

---

## 🚀 Key Features

*   **📊 Interactive Dashboard**: Real-time visualization of Bed Occupancy, Revenue, and Patient Demographics.
*   **🤖 AI Predictions**: 
    *   Forecast daily patient admissions for the next 14 days.
    *   Detect anomalies in admission trends.
    *   Generate automated insights for capacity planning.
*   **🩺 Patient Flow**: manage admissions, discharges, and transfers efficiently.
*   **👨‍⚕️ Staff Management**: Track doctor availability, shifts, and departmental resources.
*   **🩸 Inventory Control**: Monitor Blood Bank and Organ availability with real-time tracking.
*   **🔐 Role-Based Access Control (RBAC)**: Secure storage and views for CEO, CNO, CMO, and Medical Record Managers.

---

## 🛠️ Tech Stack

### Backend
*   **Framework**: Flask (Python)
*   **Database**: MySQL
*   **ML Libraries**: Statsmodels (SARIMA), Scikit-learn (Isolation Forest), Pandas, NumPy.
*   **API**: RESTful architecture with Blueprints.

### Frontend
*   **Structure**: HTML5, Vanilla JavaScript (ES6+), CSS3.
*   **Styling**: Custom CSS + TailwindCSS (CDN).
*   **Visualization**: Plotly.js for interactive charts.

---

## 📂 Project Structure

```bash
Hospital-Management/
├── backend/
│   ├── app.py                  # Entry Point
│   ├── config.py               # DB Configuration
│   ├── routes/                 # API Endpoints (Auth, Patients, Predictions...)
│   ├── services/               # Business Logic (Prediction Service)
│   ├── ml/                     # ML Models & Analysis Scripts
│   └── scripts/                # Maintenance Utilities
│
├── frontend/
│   ├── templates/
│   │   └── index.html          # Single Page Application Root
│   ├── js/                     # Frontend Logic (main_v4.js)
│   └── css/                    # Stylesheets
│
└── database/
    ├── schema.sql              # Database Schema
    └── seed_data.sql           # Demo Data
```

---

## ⚡ Getting Started

### Prerequisites
*   Python 3.9+
*   MySQL Server 8.0+

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/medcare-ai.git
    cd medcare-ai
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Database Configuration**
    *   Create a MySQL database named `hospital_db`.
    *   Import `database/schema.sql` and `database/seed_data.sql`.
    *   Create a `.env` file in `backend/` (see `.env.example`):
        ```env
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=yourpassword
        DB_NAME=hospital_db
        ```

4.  **Run the Application**
    ```bash
    # From backend directory
    python app.py
    ```
    Visit `http://localhost:5000` in your browser.

---

## 🧪 Machine Learning Details
The system uses **SARIMA (Seasonal Auto-Regressive Integrated Moving Average)** to analyze historical daily admission data. 
- **Training**: Auto-retrains on new data entry.
- **Accuracy**: Calculates MAPE (Mean Absolute Percentage Error) for validation.
- **EDA**: Includes an Exploratory Data Analysis module in `backend/ml/eda_analysis.py`.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
