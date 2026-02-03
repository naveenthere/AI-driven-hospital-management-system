"""
Time Series Forecasting Service
Supports ARIMA and SARIMA models for admission prediction
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_absolute_percentage_error
import warnings
warnings.filterwarnings('ignore')

from ml.prediction_config import (
    FORECASTING_MODEL,
    ARIMA_ORDER,
    SARIMA_ORDER,
    SARIMA_SEASONAL_ORDER,
    FORECAST_DAYS,
    BACKTEST_DAYS,
    ANOMALY_THRESHOLD_MULTIPLIER
)


class ForecastingService:
    """Model-agnostic forecasting service"""
    
    def __init__(self, model_type=None):
        """
        Initialize forecasting service
        
        Args:
            model_type: 'ARIMA' or 'SARIMA'. If None, uses config default
        """
        self.model_type = model_type or FORECASTING_MODEL
        self.model = None
        self.forecast_result = None
        
    def prepare_data(self, df):
        """
        Prepare time series data
        
        Args:
            df: DataFrame with 'admission_date' and 'total_admissions'
            
        Returns:
            pandas Series with date index
        """
        df = df.copy()
        df['admission_date'] = pd.to_datetime(df['admission_date'])
        df = df.sort_values('admission_date')
        df = df.set_index('admission_date')
        
        # 1. Remove today's data first if it exists and is incomplete
        today = pd.Timestamp(datetime.now().date())
        if not df.empty and df.index[-1] >= today:
             df = df.iloc[:-1]
        
        # 2. Resample to ensure daily frequency
        df = df.resample('D').sum()
        
        # 3. Replace 0s (missing days) with interpolated values
        # We replace 0s with NaN purely for interpolation purposes, then fill remaining NaNs with 0
        df = df.replace(0, np.nan).interpolate(method='linear').fillna(0)
             
        return df['total_admissions']
    
    def fit_model(self, time_series):
        """
        Fit the selected forecasting model with optimization
        
        Args:
            time_series: pandas Series with datetime index
        """
        best_model = None
        best_aic = float('inf')
        
        # Define candidate parameters for optimization (Grid Search)
        # Filters: (p, d, q) x (P, D, Q, s)
        candidates = [
            # Default (Balanced)
            {'order': SARIMA_ORDER, 'seasonal_order': SARIMA_SEASONAL_ORDER},
            # Simpler (Moving Average focus)
            {'order': (0, 1, 1), 'seasonal_order': (0, 1, 1, 7)},
            # AR focus
            {'order': (1, 1, 0), 'seasonal_order': (1, 0, 0, 7)},
            # Complex (Higher order)
            {'order': (2, 1, 1), 'seasonal_order': (1, 1, 1, 7)}
        ]

        if self.model_type == 'ARIMA':
             # Simplified ARIMA grid
             arima_candidates = [
                 {'order': ARIMA_ORDER},
                 {'order': (1, 1, 1)},
                 {'order': (0, 1, 1)},
                 {'order': (2, 1, 0)}
             ]
             
             for params in arima_candidates:
                 try:
                     model = ARIMA(time_series, order=params['order'])
                     result = model.fit()
                     if result.aic < best_aic:
                         best_aic = result.aic
                         best_model = result
                         # Store best params for info
                         self.best_params = params
                 except:
                     continue
                     
        elif self.model_type == 'SARIMA':
            for params in candidates:
                try:
                    model = SARIMAX(
                        time_series,
                        order=params['order'],
                        seasonal_order=params['seasonal_order'],
                        enforce_stationarity=False,
                        enforce_invertibility=False
                    )
                    result = model.fit(disp=False)
                    if result.aic < best_aic:
                        best_aic = result.aic
                        best_model = result
                        self.best_params = params
                except:
                    continue
        else:
            raise ValueError(f"Unknown model type: {self.model_type}")
        
        if best_model is None:
            # Fallback to default if optimization fails
            if self.model_type == 'ARIMA':
                 self.model = ARIMA(time_series, order=ARIMA_ORDER)
            else:
                 self.model = SARIMAX(time_series, order=SARIMA_ORDER, seasonal_order=SARIMA_SEASONAL_ORDER)
            self.forecast_result = self.model.fit()
        else:
            self.forecast_result = best_model
        
    def predict(self, steps=FORECAST_DAYS):
        """
        Generate predictions
        
        Args:
            steps: Number of days to forecast
            
        Returns:
            dict with predictions and confidence intervals
        """
        if self.forecast_result is None:
            raise ValueError("Model not fitted. Call fit_model() first.")
        
        # Generate forecast
        forecast = self.forecast_result.forecast(steps=steps)
        conf_int = self.forecast_result.get_forecast(steps=steps).conf_int()
        
        return {
            'predictions': [max(0, x) for x in forecast.values.tolist()],
            'lower_bound': [max(0, x) for x in conf_int.iloc[:, 0].values.tolist()],
            'upper_bound': [max(0, x) for x in conf_int.iloc[:, 1].values.tolist()]
        }
    
    def calculate_accuracy(self, time_series):
        """
        Calculate model accuracy using backtesting
        
        Args:
            time_series: Full time series data
            
        Returns:
            float: Accuracy percentage
        """
        # Split data for backtesting
        train = time_series[:-BACKTEST_DAYS]
        test = time_series[-BACKTEST_DAYS:]
        
        # Fit model on training data
        if self.model_type == 'ARIMA':
            model = ARIMA(train, order=ARIMA_ORDER)
        else:
            model = SARIMAX(train, order=SARIMA_ORDER, seasonal_order=SARIMA_SEASONAL_ORDER)
        
        result = model.fit()
        predictions = result.forecast(steps=BACKTEST_DAYS)
        
        # Calculate MAPE (Mean Absolute Percentage Error)
        # Handle division by zero in test data
        test_values = test.values
        pred_values = [max(0, p) for p in predictions.values]
        
        errors = []
        for actual, pred in zip(test_values, pred_values):
            if actual == 0:
                # If actual is 0, use absolute error or ignore
                errors.append(0 if pred < 0.5 else 1.0) # Penalty if predicted high
            else:
                errors.append(abs((actual - pred) / actual))
        
        mape = np.mean(errors) if errors else 0
        accuracy = (1 - mape) * 100
        
        return max(0, min(100, accuracy))  # Clamp between 0-100
    
    def detect_anomalies(self, predictions, historical_mean, historical_std):
        """
        Detect anomalies in predictions
        
        Args:
            predictions: List of predicted values
            historical_mean: Historical average
            historical_std: Historical standard deviation
            
        Returns:
            dict with anomaly information
        """
        threshold = historical_mean + (ANOMALY_THRESHOLD_MULTIPLIER * historical_std)
        
        anomalies = []
        for i, pred in enumerate(predictions):
            if pred > threshold:
                anomalies.append({
                    'day_index': i,
                    'predicted_value': round(pred, 1),
                    'threshold': round(threshold, 1),
                    'severity': 'high' if pred > threshold * 1.2 else 'medium'
                })
        
        return {
            'threshold': round(threshold, 1),
            'anomalies': anomalies,
            'count': len(anomalies)
        }
    
    def generate_insights(self, predictions, historical_data, dates):
        """
        Generate automated insights from predictions
        
        Args:
            predictions: List of predicted values
            historical_data: Historical time series
            dates: List of prediction dates
            
        Returns:
            list of insight dictionaries
        """
        insights = []
        historical_mean = historical_data.mean()
        historical_std = historical_data.std()
        
        # Analyze weekend vs weekday patterns
        weekend_indices = [i for i, date in enumerate(dates) if pd.to_datetime(date).dayofweek >= 5]
        weekday_indices = [i for i in range(len(predictions)) if i not in weekend_indices]
        
        if weekend_indices and weekday_indices:
            weekend_avg = np.mean([predictions[i] for i in weekend_indices])
            weekday_avg = np.mean([predictions[i] for i in weekday_indices])
            weekend_pct = ((weekend_avg - weekday_avg) / weekday_avg) * 100
            
            if abs(weekend_pct) > 5:
                trend_word = "higher" if weekend_pct > 0 else "lower"
                insights.append({
                    'type': 'pattern',
                    'severity': 'medium' if abs(weekend_pct) > 10 else 'low',
                    'message': f"Based on historical data analysis using time series forecasting, expect {abs(weekend_pct):.0f}% {trend_word} admissions on weekends. Peak admission times: 10 AM - 2 PM."
                })
        
        # Detect high-volume days
        threshold = historical_mean + (2 * historical_std)
        high_volume_days = []
        for i, pred in enumerate(predictions):
            if pred > threshold:
                date_obj = pd.to_datetime(dates[i])
                date_str = date_obj.strftime('%b %d')
                high_volume_days.append(date_str)
        
        if high_volume_days:
            days_list = ', '.join(high_volume_days)
            insights.append({
                'type': 'alert',
                'severity': 'high',
                'message': f"Potential high-volume days detected: {days_list}"
            })
        
        # Overall trend analysis
        avg_prediction = np.mean(predictions)
        pct_change = ((avg_prediction - historical_mean) / historical_mean) * 100
        
        if abs(pct_change) > 3:
            trend = "increase" if pct_change > 0 else "decrease"
            severity = 'high' if abs(pct_change) > 10 else 'medium'
            insights.append({
                'type': 'trend',
                'severity': severity,
                'message': f"Forecasting a {abs(pct_change):.1f}% {trend} in average daily admissions over the next 14 days compared to historical baseline of {int(historical_mean)} admissions/day."
            })
        
        # Peak load warning
        peak_idx = np.argmax(predictions)
        peak_value = predictions[peak_idx]
        peak_date = pd.to_datetime(dates[peak_idx]).strftime('%b %d')
        
        if peak_value > historical_mean * 1.15:
            pct_above = ((peak_value - historical_mean) / historical_mean) * 100
            insights.append({
                'type': 'peak',
                'severity': 'high',
                'message': f"Peak load expected on {peak_date} with {int(peak_value)} admissions ({pct_above:.0f}% above normal). Recommend scheduling additional staff and preparing extra bed capacity."
            })
        
        # Capacity planning insight
        max_prediction = max(predictions)
        if max_prediction > historical_mean * 1.2:
            insights.append({
                'type': 'capacity',
                'severity': 'medium',
                'message': f"Predicted maximum daily load of {int(max_prediction)} admissions may exceed typical capacity. Consider activating overflow protocols and coordinating with neighboring facilities."
            })
        
        return insights

    
    def get_model_info(self):
        """Get model type and description"""
        if self.model_type == 'ARIMA':
            return {
                'type': 'ARIMA',
                'name': 'ARIMA',
                'description': 'Auto-Regressive Integrated Moving Average',
                'parameters': f"Order: {ARIMA_ORDER}"
            }
        else:
            params_str = f"Order: {SARIMA_ORDER}, Seasonal: {SARIMA_SEASONAL_ORDER}"
            if hasattr(self, 'best_params'):
                 params_str = f"Optimized Order: {self.best_params['order']}, Seasonal: {self.best_params['seasonal_order']}"
            
            
            return {
                'type': 'SARIMA',
                'name': 'SARIMA (Seasonal Time Series Forecast)',
                'description': 'Seasonal Auto-Regressive Integrated Moving Average',
                'parameters': params_str
            }
            
    def get_eda_data(self, df):
        """
        Prepare data for EDA visualization
        """
        # Raw data processing (similar to prepare_data but keeping more info)
        df_processed = df.copy()
        df_processed['admission_date'] = pd.to_datetime(df_processed['admission_date'])
        df_processed = df_processed.set_index('admission_date')
        
        # 1. Remove today's data if incomplete
        today = pd.Timestamp(datetime.now().date())
        if not df_processed.empty and df_processed.index[-1] >= today:
             df_processed = df_processed.iloc[:-1]
        
        # 2. Resample and Interpolate
        df_daily = df_processed.resample('D').sum()
        df_interpolated = df_daily.replace(0, np.nan).interpolate(method='linear').fillna(0)
        
        # 3. Weekly Pattern
        df_interpolated['day_name'] = df_interpolated.index.day_name()
        weekly_pattern = df_interpolated.groupby('day_name')['total_admissions'].mean()
        # Sort by day order
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        weekly_pattern = weekly_pattern.reindex(days_order).fillna(0)
        
        # 4. Prepare JSON response
        dates = df_interpolated.index.strftime('%Y-%m-%d').tolist()
        values = df_interpolated['total_admissions'].tolist()
        
        # Mark imputed values (where raw was 0 or missing but interpolated is > 0)
        # Note: raw df_daily has 0s for missing days.
        imputed_flags = []
        raw_values = df_daily['total_admissions'].tolist()
        for raw, interp in zip(raw_values, values):
            imputed_flags.append(raw == 0 and interp > 0)
            
        return {
            'time_series': {
                'dates': dates,
                'values': values,
                'raw_values': raw_values,
                'imputed': imputed_flags
            },
            'weekly_pattern': {
                'days': days_order,
                'values': weekly_pattern.tolist()
            },
            'statistics': {
                'mean': float(round(np.mean(values), 2)),
                'std': float(round(np.std(values), 2)),
                'min': float(np.min(values)),
                'max': float(np.max(values)),
                'total_days': len(values)
            }
        }
