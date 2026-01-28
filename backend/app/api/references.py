from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.db.database import get_db
from app.db.models import User, Reference, MentorProfile
from app.deps import get_current_user

router = APIRouter()

# --- Pydantic Models ---
class ReferenceCreate(BaseModel):
    student_id: int
    content: str

class ReferenceResponse(BaseModel):
    id: int
    mentor_id: int
    student_id: int
    # content: str # HIDDEN if silent?
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Endpoints ---

@router.post("/", response_model=ReferenceResponse)
def create_reference(
    ref: ReferenceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can write references")
        
    # Check if student exists
    student = db.query(User).filter(User.id == ref.student_id, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_ref = Reference(
        mentor_id=current_user.id,
        student_id=ref.student_id,
        content=ref.content,
        is_silent=True # Default to silent per requirements
    )
    
    # Update Mentor Reputation (Simple Logic: +1 outcome for giving a reference)
    # Ideally this would be tied to placement success, but let's increment for activity now.
    if current_user.mentor_profile:
        current_user.mentor_profile.outcome_count += 1
        # Calculate new score (example logic)
        current_user.mentor_profile.reputation_score = min(5.0, 1.0 + (current_user.mentor_profile.outcome_count * 0.1))
        
    db.add(new_ref)
    db.commit()
    db.refresh(new_ref)
    return new_ref

@router.get("/student/{student_id}", response_model=List[ReferenceResponse])
def get_student_references(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Visibility Rules:
    # Students cannot see their own silent references.
    # Mentors can see references for students they are evaluating? 
    # For now, let's say ONLY other Mentors can see existence of references.
    
    if current_user.role == "student" and current_user.id == student_id:
        # Student viewing own profile -> return empty or sanitized?
        # Requirement: "Reference visibility rules (private by design)"
        # So maybe they see nothing.
        return []
        
    if current_user.role == "mentor":
        refs = db.query(Reference).filter(Reference.student_id == student_id).all()
        return refs
        
    return []
