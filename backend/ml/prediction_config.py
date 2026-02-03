"""
Configuration for Admission Prediction Module
Model selection and forecasting parameters
"""

# Model Selection (Change this to switch between models)
FORECASTING_MODEL = 'SARIMA'  # Options: 'ARIMA' or 'SARIMA'

# ARIMA Parameters (p, d, q)
ARIMA_ORDER = (2, 1, 2)  # Auto-regressive, Differencing, Moving Average

# SARIMA Parameters (p, d, q) x (P, D, Q, s)
SARIMA_ORDER = (1, 1, 1)  # Non-seasonal order
SARIMA_SEASONAL_ORDER = (1, 1, 1, 7)  # Seasonal order with 7-day cycle

# Forecasting Settings
FORECAST_DAYS = 14  # Number of days to predict
HISTORICAL_DAYS_REQUIRED = 60  # Minimum historical data needed

# Anomaly Detection Settings
ANOMALY_THRESHOLD_MULTIPLIER = 1.5  # Multiplier for standard deviation
ANOMALY_METHOD = 'statistical'  # Options: 'statistical', 'residual'

# Model Performance
BACKTEST_DAYS = 7  # Days to use for backtesting accuracy
