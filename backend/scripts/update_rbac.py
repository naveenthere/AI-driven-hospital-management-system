import json
import sys
import os

from config import get_db_connection

def update_rbac():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect to database")
        return

    cursor = conn.cursor(dictionary=True)

    try:
        print("\n--- UPDATING ROLES ---")

        # 1. Update CNO Access (Add 'records')
        # Previous: ['patients', 'staff']
        cno_access = json.dumps(['patients', 'staff', 'records'])
        cursor.execute("UPDATE users SET access = %s WHERE role = 'CNO'", (cno_access,))
        print(f"Updated CNO access to: {cno_access}")

        # 2. Update CMO Access (Add 'dashboard', 'patients', 'staff', 'records')
        # Previous: ['inventory']
        cmo_access = json.dumps(['dashboard', 'patients', 'staff', 'inventory', 'records'])
        cursor.execute("UPDATE users SET access = %s WHERE role = 'CMO'", (cmo_access,))
        print(f"Updated CMO access to: {cmo_access}")

        # 3. Remove CCO Role
        cursor.execute("DELETE FROM users WHERE role = 'CCO'")
        print("Removed CCO role (if existed)")

        # 4. Handle PRM -> MRM
        cursor.execute("SELECT * FROM users WHERE role = 'PRM' OR role = 'MRM' OR userId = 'PRM001' OR userId = 'MRM001'")
        mrm_users = cursor.fetchall()
        
        if mrm_users:
            for user in mrm_users:
                print(f"Found Record Manager: {user['userId']} ({user['role']})")
                
                if user['userId'] == 'PRM001':
                    print("Renaming PRM001 to MRM001...")
                    # Update ID, Role, Name
                    cursor.execute("""
                        UPDATE users 
                        SET userId = 'MRM001', role = 'MRM', name = 'Medical Record Manager', password = 'mrm@123' 
                        WHERE userId = 'PRM001'
                    """)
                    # Update access to just records (or whatever default was)
                    # MRM usually has 'records'
                    cursor.execute("UPDATE users SET access = %s WHERE userId = 'MRM001'", (json.dumps(['records']),))
        else:
            print("No PRM/MRM user found. Creating MRM001...")
            cursor.execute("""
                INSERT INTO users (userId, password, role, name, access) 
                VALUES ('MRM001', 'mrm@123', 'MRM', 'Medical Record Manager', %s)
            """, (json.dumps(['records']),))

        conn.commit()
        print("✅ RBAC Updates Committed")

        # 5. Verify ALL Users
        print("\n--- VERIFICATION (Current Users) ---")
        cursor.execute("SELECT userId, role, access FROM users")
        users = cursor.fetchall()
        for u in users:
            print(f"{u['userId']} ({u['role']}): {u['access']}")

    except Exception as e:
        print(f"❌ Error during update: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    update_rbac()
