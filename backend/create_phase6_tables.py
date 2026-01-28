from app.db.database import engine, Base
from app.db.models import Message, Meeting, Reference, ProjectFile, MentorProfile

# Create tables
print("Creating Phase 6 tables...")
Base.metadata.create_all(bind=engine)
print("Phase 6 Tables created.")
