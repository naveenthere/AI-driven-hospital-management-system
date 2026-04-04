# AI-Driven Hospital Management System 🏥

A robust, full-stack Hospital Management System equipped with Advanced Machine Learning Predictions and a Local, Private AI Chatbot powered by Ollama. 

Designed to streamline operations, manage resources, and provide hospital executives with real-time, data-driven insights.

---

## 🌟 Key Features

### 1. **Complete Dashboard Hub**
- **Patient Flow Management**: Track admissions, ward statuses, critical patients, and discharges.
- **Resource & Inventory Management**: Monitor ICU beds, general wards, ventilators, and blood donor stocks.
- **Finance & Staffing**: Track total income vs. expenses, un-processed payroll, and monitor staff attendance dynamically.

### 2. **Machine Learning Predictions (SARIMA)**
A state-of-the-art predictive module analyzing historical daily admission bounds to forecast the next 14 days of patient flow. 
- Automatically identifies anomalous intake levels.
- Smooths missing data using background statistical modeling.
- Enables staff scaling before major surges occur.

### 3. **AI Executive Assistant (Local LLM Integration)**
A fully private context-aware AI chatbot widget integrated directly into the dashboard.
- Uses Meta's `llama3.2` model locally via **Ollama** ensuring **zero patient data** leaves the server.
- Uses a robust Retrieval-Augmented Generation (RAG) pipeline: Extracts intents (Revenue, Stock, Staffing, Patient Info), queries the secure backend MySQL database, and delegates to the LLM to provide natural, conversational responses.
- Enforces strict **Role-Based Access Control (RBAC)** — staff can only query information their credentials permit.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Custom + Vanilla Tailwind-esque utility), Vanilla JavaScript (`app.py` served).
- **Backend Server**: Python (Flask, Blueprint API architecture).
- **Database**: MySQL (`hospital_management`).
- **Machine Learning**: `pandas`, `statsmodels`, `scikit-learn` (SARIMA forecasting).
- **Natural Language Processing**: `requests` (Ollama Local API integration).

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### Prerequisites
- Python 3.10+
- MySQL Server (XAMPP / MySQL Workbench)
- [Ollama](https://ollama.com/) (For AI Chatbot Features)

### 1. Database Setup
1. Open MySQL Workbench or XAMPP phpMyAdmin.
2. Create a new database named `hospital_management`.
3. Import the system schema. 

### 2. Backend Setup
1. Clone the repository and navigate into the project wrapper:
   ```bash
   git clone https://github.com/naveenthere/AI-driven-hospital-management-system.git
   cd AI-driven-hospital-management-system/backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   # Windows (Powershell):
   .\.venv\Scripts\Activate.ps1
   # Mac/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Verify your database connection in `config.py` (ensure your root password matches).

### 3. Activating the AI Assistant (Ollama)
For the chatbot widget to correctly process queries:
1. Ensure Ollama is installed on your machine.
2. Open a separate terminal and run:
   ```bash
   ollama run llama3.2
   ```
   *Note: This will download the lightweight language model. It requires at least 4GB to 8GB of RAM. The backend will fall back to safe error messages if Ollama is perfectly offline!*

### 4. Running the Application
From the `backend` folder, with your virtual environment active, run:
```bash
python app.py
```
**Access the dashboard at**: `http://localhost:5000`

---

## 🔒 Demo Credentials
Use these sample rolls to explore the Role-Based Access Control on the login screen:
- **CEO**: `CEO001` / `ceo@123` *(Has Full Access + AI Assistant privileges)*
- **CFO**: `CFO001` / `cfo@123` *(Has Finance Access)*

---

*Project developed for modern, data-driven healthcare administration.*
