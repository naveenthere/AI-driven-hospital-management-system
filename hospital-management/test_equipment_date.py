import mysql.connector
from datetime import date

# Connect to database
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='#Nav05mysql',
    database='hospital_management'
)

cursor = conn.cursor(dictionary=True)

# Query equipment
cursor.execute("SELECT id, name, department, status, last_service FROM equipment LIMIT 1")
result = cursor.fetchone()

print("Result:", result)
print("Type of last_service:", type(result['last_service']) if result and result.get('last_service') else "None")

if result and result.get('last_service'):
    date_obj = result['last_service']
    print("Has strftime?", hasattr(date_obj, 'strftime'))
    if hasattr(date_obj, 'strftime'):
        print("Formatted:", date_obj.strftime('%Y-%m-%d'))

cursor.close()
conn.close()
