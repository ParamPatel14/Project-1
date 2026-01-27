import sys
import os

# Add the current directory to sys.path to make app imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine
from sqlalchemy import text

def fix_schema():
    print("Attempting to fix database schema...")
    with engine.connect() as conn:
        # 1. Check and add is_active
        try:
            print("Adding 'is_active' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE"))
            print("Successfully added 'is_active' column.")
        except Exception as e:
            print(f"Skipping 'is_active': {e}")
            # In case transaction failed, rollback to continue
            conn.rollback()
        
        # 2. Check and add provider
        try:
            print("Adding 'provider' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN provider VARCHAR DEFAULT 'local'"))
            print("Successfully added 'provider' column.")
        except Exception as e:
            print(f"Skipping 'provider': {e}")
            conn.rollback()
            
        # 3. Check and add role (just in case)
        try:
            print("Adding 'role' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user'"))
            print("Successfully added 'role' column.")
        except Exception as e:
            print(f"Skipping 'role': {e}")
            conn.rollback()

        conn.commit()
    print("Schema fix attempt completed.")

if __name__ == "__main__":
    fix_schema()
