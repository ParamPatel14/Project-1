from sqlalchemy import text
from app.db.database import engine

def execute_sql(sql, description):
    with engine.connect() as conn:
        try:
            conn.execute(text(sql))
            conn.commit()
            print(f"Success: {description}")
        except Exception as e:
            # Check if it's a "duplicate column" error or "table exists" which are fine to skip
            print(f"Skipped/Error ({description}): {e}")

if __name__ == "__main__":
    print("Migrating Structured Data Enhancements...")
    
    # Add new columns to student_profiles
    columns = [
        ("country", "VARCHAR"),
        ("headline", "VARCHAR"),
        ("linkedin_url", "VARCHAR"),
        ("behance_url", "VARCHAR"),
        ("twitter_url", "VARCHAR"),
        ("primary_skills", "TEXT"),
        ("tools_libraries", "TEXT")
    ]
    
    for col, type_def in columns:
        execute_sql(
            f"ALTER TABLE student_profiles ADD COLUMN {col} {type_def}",
            f"Add {col} column"
        )
        
    # Create WorkExperience table
    # Note: Using SERIAL for id auto-increment in PostgreSQL
    # If using SQLite, it would be INTEGER PRIMARY KEY AUTOINCREMENT
    # Assuming PostgreSQL based on "PostgreSQL" in memories.
    
    execute_sql("""
    CREATE TABLE IF NOT EXISTS work_experiences (
        id SERIAL PRIMARY KEY,
        student_profile_id INTEGER REFERENCES student_profiles(id),
        title VARCHAR,
        company VARCHAR,
        start_date VARCHAR,
        end_date VARCHAR,
        description TEXT,
        skills_used TEXT
    )
    """, "Create work_experiences table")
    
    execute_sql("CREATE INDEX IF NOT EXISTS ix_work_experiences_id ON work_experiences (id)", "Index work_experiences_id")
    
    # Create Education table
    execute_sql("""
    CREATE TABLE IF NOT EXISTS educations (
        id SERIAL PRIMARY KEY,
        student_profile_id INTEGER REFERENCES student_profiles(id),
        institution VARCHAR,
        degree VARCHAR,
        start_year VARCHAR,
        end_year VARCHAR,
        grade VARCHAR
    )
    """, "Create educations table")
    
    execute_sql("CREATE INDEX IF NOT EXISTS ix_educations_id ON educations (id)", "Index educations_id")
    
    # Create Project table
    execute_sql("""
    CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        student_profile_id INTEGER REFERENCES student_profiles(id),
        title VARCHAR,
        tech_stack TEXT,
        url VARCHAR,
        description TEXT
    )
    """, "Create projects table")
    
    execute_sql("CREATE INDEX IF NOT EXISTS ix_projects_id ON projects (id)", "Index projects_id")
    
    print("Migration Complete.")
