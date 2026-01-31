from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
from app.db.database import Base
from app.db.models import Publication # Import to register with Base

# Load env from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found")
    exit(1)

print(f"Connecting to database...")
engine = create_engine(DATABASE_URL)

def add_column(table, column, type_def):
    with engine.connect() as conn:
        try:
            conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {type_def}"))
            print(f"Added column {column} to {table}")
        except Exception as e:
            print(f"Error adding {column} (might exist): {e}")
        conn.commit()

# Add PhD Matcher columns to student_profiles
add_column("student_profiles", "is_phd_seeker", "BOOLEAN DEFAULT FALSE")
add_column("student_profiles", "research_interests", "TEXT")
add_column("student_profiles", "gpa", "VARCHAR")
add_column("student_profiles", "gre_score", "VARCHAR")
add_column("student_profiles", "toefl_score", "VARCHAR")

# Add PhD Supervisor columns to mentor_profiles
add_column("mentor_profiles", "accepting_phd_students", "VARCHAR")
add_column("mentor_profiles", "funding_available", "VARCHAR")
add_column("mentor_profiles", "preferred_backgrounds", "TEXT")
add_column("mentor_profiles", "min_expectations", "TEXT")
add_column("mentor_profiles", "max_student_requests", "INTEGER DEFAULT 5")

# Add mentor_profile_id to publications
add_column("publications", "mentor_profile_id", "INTEGER REFERENCES mentor_profiles(id)")

# Create new tables (like publications) if they don't exist
print("Creating new tables if needed...")
Base.metadata.create_all(bind=engine)

print("Migration completed.")
