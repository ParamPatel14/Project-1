import sqlite3
import os

DB_PATH = "sql_app.db"

if not os.path.exists(DB_PATH):
    print("Database not found, skipping migration")
    exit(0)

print(f"Migrating database at {DB_PATH}")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def add_column(table, column, type_def):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type_def}")
        print(f"Added column {column} to {table}")
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e):
            print(f"Column {column} already exists in {table}")
        else:
            print(f"Error adding {column} to {table}: {e}")

# Add Mentor Type columns to mentor_profiles
add_column("mentor_profiles", "mentor_type", "VARCHAR DEFAULT 'academic_supervisor'")
add_column("mentor_profiles", "company", "VARCHAR")

conn.commit()
conn.close()