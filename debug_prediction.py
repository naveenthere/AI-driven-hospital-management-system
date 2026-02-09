
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from config import get_db_connection
from services.prediction_service import ForecastingService
import pandas as pd
from datetime import datetime


def debug_predictions():
    with open('debug_output.txt', 'w') as f:
        f.write("--- 1. Fetching Data ---\n")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = """
            SELECT admission_date, total_admissions
            FROM daily_admissions
            ORDER BY admission_date ASC
        """
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        
        f.write(f"Total records: {len(data)}\n")
        if data:
            f.write(f"First record: {data[0]}\n")
            f.write(f"Last record: {data[-1]}\n")
        
        df = pd.DataFrame(data)
        f.write("\nLast 10 records from DB:\n")
        f.write(str(df.tail(10)) + "\n")
        
        f.write("\n--- 2. Preparing Data ---\n")
        service = ForecastingService()
        ts = service.prepare_data(df)
        
        f.write(f"Time Series Head:\n{ts.head()}\n")
        f.write(f"\nTime Series Tail:\n{ts.tail()}\n")
        f.write(f"\nTime Series Description:\n{ts.describe()}\n")
        
        f.write("\n--- 3. Fitting Model ---\n")
        try:
            service.fit_model(ts)
            f.write("Model fitted successfully.\n")
            f.write(f"Model Type: {service.model_type}\n")
            if hasattr(service, 'best_params'):
                f.write(f"Best Params: {service.best_params}\n")
        except Exception as e:
            f.write(f"Error fitting model: {e}\n")
            return

        f.write("\n--- 4. Forecasting ---\n")
        try:
            forecast = service.predict(steps=14)
            f.write("Predictions:\n")
            f.write(str(forecast['predictions']) + "\n")
        except Exception as e:
            f.write(f"Error forecasting: {e}\n")

if __name__ == "__main__":
    debug_predictions()
