
import mysql.connector
from db_config import DB_CONFIG

def apply_migration():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        with open('migrations/chat_tables.sql', 'r') as f:
            sql_script = f.read()
            
        # Split by semicolon and execute each statement
        statements = sql_script.split(';')
        for statement in statements:
            if statement.strip():
                cursor.execute(statement)
                print("Executed SQL statement successfully.")
                
        conn.commit()
        print("Migration applied successfully.")
        
    except Exception as e:
        print(f"Migration failed: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'conn' in locals(): conn.close()

if __name__ == "__main__":
    apply_migration()
