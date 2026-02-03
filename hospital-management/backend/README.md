# Backend - MedCare AI

The backend is built with **Flask** and serves as the REST API for the frontend and the host for the ML models.

## Key Directories

*   **`routes/`**: Contains Flask Blueprints for different modules (Auth, Patients, Finance, etc.).
*   **`services/`**: Contains `prediction_service.py` which handles the SARIMA model logic.
*   **`ml/`**: Stores ML configuration (`prediction_config.py`) and analysis scripts (`eda_analysis.py`).
*   **`scripts/`**: Utility scripts for database maintenance (e.g., RBAC updates).

## Running Locally

```bash
python app.py
```
Ensure `.env` is configured with your MySQL credentials.
