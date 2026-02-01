from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Any
from app.db.database import get_db
from app.db.models import User
from app.deps import get_current_user
from app.services.research_service import ResearchService

router = APIRouter()

@router.post("/mentors/{mentor_id}/ingest")
async def ingest_publications(
    mentor_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Auth check: Admin or the Mentor themselves
    if current_user.role != "admin" and (current_user.mentor_profile is None or current_user.mentor_profile.id != mentor_id):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Run in background as it calls AI
    background_tasks.add_task(ResearchService.ingest_publications, db, mentor_id)
    return {"message": "Ingestion started in background"}

@router.post("/mentors/{mentor_id}/analyze")
async def analyze_research(
    mentor_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Auth check
    if current_user.role != "admin" and (current_user.mentor_profile is None or current_user.mentor_profile.id != mentor_id):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    background_tasks.add_task(ResearchService.analyze_trends, db, mentor_id)
    return {"message": "Analysis started in background"}

@router.get("/mentors/{mentor_id}/analytics")
def get_analytics(
    mentor_id: int,
    db: Session = Depends(get_db)
):
    # Publicly accessible (or at least for logged in users)
    return ResearchService.get_mentor_analytics(db, mentor_id)
