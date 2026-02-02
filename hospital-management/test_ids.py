import sys
sys.path.insert(0, 'backend')
from dotenv import load_dotenv
load_dotenv('backend/.env')
from db_config import get_db_connection

conn = get_db_connection()
cursor = conn.cursor(dictionary=True)

# Check what IDs exist
cursor.execute("SELECT id, opd, name FROM patients ORDER BY id")
patients = cursor.fetchall()

print('Current patients in database:')
for p in patients:
    print(f"{p['id']} | {p['opd']} | {p['name']}")

print(f'\nTotal patients: {len(patients)}')

# Test the MAX query
cursor.execute("SELECT MAX(id) as max_id FROM patients WHERE id LIKE 'ADM%'")
result = cursor.fetchone()
max_id = result['max_id'] if result else None
print(f'\nMAX(id) result: {max_id}')

if max_id:
    try:
        num = int(max_id[3:])
        next_num = num + 1
        next_id = f"ADM{next_num:03d}"
        print(f'Extracted number: {num}')
        print(f'Next ID should be: {next_id}')
    except Exception as e:
        print(f'Error parsing ID: {e}')

cursor.close()
conn.close()
