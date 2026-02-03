"""
Database Configuration for Hospital Management System
MySQL connection settings and utilities
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# MySQL Database Configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'hospital_management'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'autocommit': False,
    'raise_on_warnings': True
}


def get_db_connection():
    """
    Create and return a MySQL database connection
    
    Returns:
        mysql.connector.connection: Database connection object
    
    Example:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM patients")
        results = cursor.fetchall()
        cursor.close()
        conn.close()
    """
    import mysql.connector
    from mysql.connector import Error
    
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print(f"✅ Connected to MySQL database: {DB_CONFIG['database']}")
            return connection
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        return None


def test_connection():
    """Test database connection"""
    conn = get_db_connection()
    if conn:
        print("✅ Database connection successful!")
        conn.close()
        return True
    else:
        print("❌ Database connection failed!")
        return False


if __name__ == '__main__':
    # Test the database connection
    print("=" * 60)
    print("🔌 Testing MySQL Database Connection")
    print("=" * 60)
    print(f"Host: {DB_CONFIG['host']}")
    print(f"Port: {DB_CONFIG['port']}")
    print(f"Database: {DB_CONFIG['database']}")
    print(f"User: {DB_CONFIG['user']}")
    print("=" * 60)
    test_connection()
