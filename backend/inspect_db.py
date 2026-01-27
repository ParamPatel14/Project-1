import sys
import os
from sqlalchemy import inspect

# Add the current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import engine

def inspect_schema():
    print("Inspecting 'users' table columns...")
    inspector = inspect(engine)
    columns = inspector.get_columns('users')
    for column in columns:
        print(f"- {column['name']} ({column['type']})")

if __name__ == "__main__":
    inspect_schema()
