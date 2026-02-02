import sys
sys.path.insert(0, 'backend')
from dotenv import load_dotenv
load_dotenv('backend/.env')
from db_config import get_db_connection
from routes.patients import generate_next_id

conn = get_db_connection()
cursor = conn.cursor(dictionary=True)

# Check remaining patients
cursor.execute('SELECT id, opd, name FROM patients ORDER BY CAST(SUBSTRING(id, 4) AS UNSIGNED)')
patients = cursor.fetchall()

print('Remaining patients in database:')
for p in patients:
    print(f"  {p['id']} | {p['opd']} | {p['name']}")

print(f'\nTotal: {len(patients)} patients')

# Test ID generation
next_adm = generate_next_id(conn, 'ADM')
next_opd = generate_next_id(conn, 'OPD')

print(f'\nNext ADM ID will be: {next_adm}')
print(f'Next OPD ID will be: {next_opd}')

cursor.close()
conn.close()
