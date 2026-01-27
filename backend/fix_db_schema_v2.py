import sys
import os
from sqlalchemy import text, inspect

# Add the current directory to sys.path to make app imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine

def fix_schema():
    print("Attempting to fix database schema with auto-commit transaction...")
    
    # Use engine.begin() for automatic transaction management (commit on success, rollback on error)
    with engine.begin() as conn:
        inspector = inspect(conn)
        columns = [c['name'] for c in inspector.get_columns('users')]
        print(f"Current columns: {columns}")

        if 'is_active' not in columns:
            print("Adding 'is_active' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE"))
            print("Executed ADD COLUMN 'is_active'")
        else:
            print("'is_active' already exists.")

        if 'provider' not in columns:
            print("Adding 'provider' column...")
            conn.execute(text("ALTER TABLE users ADD COLUMN provider VARCHAR DEFAULT 'local'"))
            print("Executed ADD COLUMN 'provider'")
        else:
            print("'provider' already exists.")

    print("Transaction committed. Verifying...")
    
    # Verify
    inspector = inspect(engine)
    new_columns = [c['name'] for c in inspector.get_columns('users')]
    print(f"New columns: {new_columns}")
    
    if 'is_active' in new_columns:
        print("SUCCESS: 'is_active' is present.")
    else:
        print("FAILURE: 'is_active' is still missing.")

if __name__ == "__main__":
    fix_schema()
