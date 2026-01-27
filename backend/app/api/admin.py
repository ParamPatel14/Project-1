from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import deps
from app.db import models
from app import schemas

router = APIRouter()

def check_admin(current_user: models.User):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )

@router.put("/verify/mentor/{user_id}", response_model=schemas.MentorProfileResponse)
def verify_mentor(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    check_admin(current_user)
    
    mentor_profile = db.query(models.MentorProfile).filter(models.MentorProfile.user_id == user_id).first()
    if not mentor_profile:
        raise HTTPException(status_code=404, detail="Mentor profile not found")
    
    mentor_profile.is_verified = True
    db.commit()
    db.refresh(mentor_profile)
    return mentor_profile

@router.get("/mentors/pending", response_model=List[schemas.MentorProfileResponse])
def get_pending_mentors(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    check_admin(current_user)
    
    mentors = db.query(models.MentorProfile).filter(models.MentorProfile.is_verified == False).all()
    return mentors
