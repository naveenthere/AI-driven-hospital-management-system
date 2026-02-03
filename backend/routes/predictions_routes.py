"""
Predictions API Routes
Handles admission forecasting, anomaly detection, and insights
"""

from flask import Blueprint, jsonify
from config import get_db_connection
from services.prediction_service import ForecastingService
from ml.prediction_config import FORECAST_DAYS
import pandas as pd
from datetime import datetime, timedelta

predictions_bp = Blueprint('predictions', __name__, url_prefix='/api/predictions')


@predictions_bp.route('/admissions', methods=['GET'])
def get_admission_predictions():
    """
    Get 14-day admission predictions
    
    Response:
    {
        "success": true,
        "model_type": "SARIMA",
        "predictions": [
            {
                "date": "2026-02-03",
                "predicted": 52.3,
                "lower_bound": 45.1,
                "upper_bound": 59.5
            },
            ...
        ],
        "historical_average": 47.5
    }
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Fetch historical data
            query = """
                SELECT admission_date, total_admissions
                FROM daily_admissions
                ORDER BY admission_date ASC
            """
            cursor.execute(query)
            historical_data = cursor.fetchall()
            
            if len(historical_data) < 30:
                return jsonify({
                    'success': False,
                    'message': 'Insufficient historical data for prediction'
                }), 400
            
            # Prepare data
            df = pd.DataFrame(historical_data)
            forecasting_service = ForecastingService()
            time_series = forecasting_service.prepare_data(df)
            
            # Fit model and predict
            forecasting_service.fit_model(time_series)
            forecast_result = forecasting_service.predict(FORECAST_DAYS)
            
            # Generate prediction dates
            # Use the last date from the prepared time series to ensure continuity
            last_date = time_series.index[-1]
            prediction_dates = [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d') 
                               for i in range(FORECAST_DAYS)]
            
            # Format predictions
            predictions = []
            for i in range(FORECAST_DAYS):
                predictions.append({
                    'date': prediction_dates[i],
                    'predicted': round(forecast_result['predictions'][i], 1),
                    'lower_bound': round(forecast_result['lower_bound'][i], 1),
                    'upper_bound': round(forecast_result['upper_bound'][i], 1)
                })
            
            # Calculate historical average
            historical_average = round(time_series.mean(), 1)
            
            # Get model info
            model_info = forecasting_service.get_model_info()
            
            return jsonify({
                'success': True,
                'model_type': model_info['name'],
                'model_description': model_info['description'],
                'predictions': predictions,
                'historical_average': historical_average,
                'forecast_days': FORECAST_DAYS
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'Prediction generation failed'
        }), 500


@predictions_bp.route('/anomalies', methods=['GET'])
def get_anomalies():
    """
    Detect anomalies in predictions
    
    Response:
    {
        "success": true,
        "threshold": 65.2,
        "anomalies": [
            {
                "date": "2026-02-10",
                "predicted_value": 68.5,
                "severity": "high"
            }
        ]
    }
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Fetch historical data
            query = """
                SELECT admission_date, total_admissions
                FROM daily_admissions
                ORDER BY admission_date ASC
            """
            cursor.execute(query)
            historical_data = cursor.fetchall()
            
            # Prepare and predict
            df = pd.DataFrame(historical_data)
            forecasting_service = ForecastingService()
            time_series = forecasting_service.prepare_data(df)
            forecasting_service.fit_model(time_series)
            forecast_result = forecasting_service.predict(FORECAST_DAYS)
            
            # Detect anomalies
            historical_mean = time_series.mean()
            historical_std = time_series.std()
            anomaly_result = forecasting_service.detect_anomalies(
                forecast_result['predictions'],
                historical_mean,
                historical_std
            )
            
            # Add dates to anomalies
            last_date = time_series.index[-1]
            for anomaly in anomaly_result['anomalies']:
                day_idx = anomaly['day_index']
                anomaly['date'] = (last_date + timedelta(days=day_idx+1)).strftime('%Y-%m-%d')
                del anomaly['day_index']
            
            return jsonify({
                'success': True,
                'threshold': anomaly_result['threshold'],
                'anomalies': anomaly_result['anomalies'],
                'anomaly_count': anomaly_result['count']
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Anomaly detection error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Anomaly detection failed'
        }), 500


@predictions_bp.route('/insights', methods=['GET'])
def get_insights():
    """
    Get automated insights from predictions
    
    Response:
    {
        "success": true,
        "insights": [
            {
                "type": "trend",
                "severity": "high",
                "message": "Predicted 12.5% increase in admissions..."
            }
        ]
    }
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Fetch historical data
            query = """
                SELECT admission_date, total_admissions
                FROM daily_admissions
                ORDER BY admission_date ASC
            """
            cursor.execute(query)
            historical_data = cursor.fetchall()
            
            # Prepare and predict
            df = pd.DataFrame(historical_data)
            forecasting_service = ForecastingService()
            time_series = forecasting_service.prepare_data(df)
            forecasting_service.fit_model(time_series)
            forecast_result = forecasting_service.predict(FORECAST_DAYS)
            
            # Generate dates
            last_date = time_series.index[-1]
            prediction_dates = [(last_date + timedelta(days=i+1)).strftime('%Y-%m-%d') 
                               for i in range(FORECAST_DAYS)]
            
            # Generate insights
            insights = forecasting_service.generate_insights(
                forecast_result['predictions'],
                time_series,
                prediction_dates
            )
            
            return jsonify({
                'success': True,
                'insights': insights,
                'insight_count': len(insights)
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Insights generation error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Insights generation failed'
        }), 500


@predictions_bp.route('/metrics', methods=['GET'])
def get_metrics():
    """
    Get model performance metrics
    
    Response:
    {
        "success": true,
        "accuracy": 87.5,
        "model_type": "SARIMA",
        "data_points": 90,
        "last_updated": "2026-01-31"
    }
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed'
            }), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            # Fetch historical data
            query = """
                SELECT admission_date, total_admissions
                FROM daily_admissions
                ORDER BY admission_date ASC
            """
            cursor.execute(query)
            historical_data = cursor.fetchall()
            
            # Prepare data
            df = pd.DataFrame(historical_data)
            forecasting_service = ForecastingService()
            time_series = forecasting_service.prepare_data(df)
            
            # Calculate accuracy
            forecasting_service.fit_model(time_series)
            accuracy = forecasting_service.calculate_accuracy(time_series)
            
            # Get model info
            model_info = forecasting_service.get_model_info()
            
            # Calculate statistics
            stats = {
                'average_daily_admissions': round(time_series.mean(), 1),
                'peak_admission_day': time_series.idxmax().strftime('%Y-%m-%d'),
                'peak_admission_value': int(time_series.max()),
                'min_admission_value': int(time_series.min()),
                'std_deviation': round(time_series.std(), 1)
            }
            
            return jsonify({
                'success': True,
                'accuracy': round(accuracy, 1),
                'model_type': model_info['name'],
                'model_description': model_info['description'],
                'data_points': len(historical_data),
                'last_updated': historical_data[-1]['admission_date'].strftime('%Y-%m-%d'),
                'statistics': stats
            }), 200
        
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"Metrics calculation error: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Metrics calculation failed'
        }), 500


@predictions_bp.route('/eda-data', methods=['GET'])
def get_eda_data_endpoint():
    """
    Get data for EDA dashboard
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'success': False, 'message': 'Database connection failed'}), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            query = "SELECT admission_date, total_admissions FROM daily_admissions ORDER BY admission_date ASC"
            cursor.execute(query)
            historical_data = cursor.fetchall()
            
            if not historical_data:
                return jsonify({'success': False, 'message': 'No data found'}), 404
                
            df = pd.DataFrame(historical_data)
            forecasting_service = ForecastingService()
            eda_data = forecasting_service.get_eda_data(df)
            
            return jsonify({'success': True, 'data': eda_data}), 200
            
        finally:
            cursor.close()
            conn.close()
    
    except Exception as e:
        print(f"EDA Data error: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500
