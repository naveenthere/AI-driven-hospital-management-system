```python
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import sys
import os

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import get_db_connection
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf


# Output directory for plots
OUTPUT_DIR = r"C:\Users\navee\.gemini\antigravity\brain\62be3012-8e57-4ac0-898a-71ee82da7681"

def fetch_data():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT admission_date, total_admissions FROM daily_admissions ORDER BY admission_date ASC"
    cursor.execute(query)
    data = cursor.fetchall()
    conn.close()
    return pd.DataFrame(data)

def perform_eda():
    print("Fetching data...")
    df = fetch_data()
    
    # Preprocessing (matching the service logic roughly)
    df['admission_date'] = pd.to_datetime(df['admission_date'])
    df = df.set_index('admission_date')
    
    # Drop today if partial (simple check)
    if df.index[-1].date() == pd.Timestamp.now().date():
        print(f"Dropping partial data for today: {df.index[-1]}")
        df = df.iloc[:-1]
        
    df = df.resample('D').sum()
    df = df.replace(0, np.nan).interpolate(method='linear').fillna(0)
    
    ts = df['total_admissions']
    
    # 1. Time Series Plot
    plt.figure(figsize=(12, 6))
    plt.plot(ts, label='Daily Admissions', marker='o', markersize=4)
    plt.title('Daily Admissions (Processed)')
    plt.xlabel('Date')
    plt.ylabel('Admissions')
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.savefig(os.path.join(OUTPUT_DIR, 'eda_timeseries.png'))
    plt.close()
    print("Generated eda_timeseries.png")
    
    # 2. Decomposition
    try:
        decomp = seasonal_decompose(ts, model='additive', period=7) # Weekly seasonality
        fig = decomp.plot()
        fig.set_size_inches(12, 10)
        plt.savefig(os.path.join(OUTPUT_DIR, 'eda_decomposition.png'))
        plt.close()
        print("Generated eda_decomposition.png")
    except Exception as e:
        print(f"Decomposition failed: {e}")

    # 3. ACF / PACF
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10))
    plot_acf(ts, ax=ax1, lags=20)
    plot_pacf(ts, ax=ax2, lags=20)
    plt.savefig(os.path.join(OUTPUT_DIR, 'eda_acf_pacf.png'))
    plt.close()
    print("Generated eda_acf_pacf.png")

    # 4. Weekly Pattern
    df['day_of_week'] = df.index.day_name()
    weekly_avg = df.groupby('day_of_week')['total_admissions'].mean().reindex(
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    )
    
    plt.figure(figsize=(10, 6))
    weekly_avg.plot(kind='bar', color='skyblue')
    plt.title('Average Admissions by Day of Week')
    plt.ylabel('Average Admissions')
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'eda_weekly_pattern.png'))
    plt.close()
    print("Generated eda_weekly_pattern.png")

if __name__ == "__main__":
    perform_eda()
