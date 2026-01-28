from sqlalchemy import text
from app.db.database import engine

def add_column(table, column, type_def):
    with engine.connect() as conn:
        try:
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {type_def}"))
            conn.commit()
            print(f"Added {column} to {table}")
        except Exception as e:
            print(f"Could not add {column} to {table}: {e}")

if __name__ == "__main__":
    print("Migrating Student Profile Enhancements...")
    add_column("student_profiles", "current_status", "VARCHAR")
    add_column("student_profiles", "start_year", "INTEGER")
    add_column("student_profiles", "interests", "TEXT")
    add_column("student_profiles", "resume_url", "VARCHAR")
    add_column("student_profiles", "phone_number", "VARCHAR")
    add_column("student_profiles", "city", "VARCHAR")
    add_column("student_profiles", "gender", "VARCHAR")
    add_column("student_profiles", "languages", "TEXT")
    print("Migration Complete.")
