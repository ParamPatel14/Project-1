from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.db.database import get_db
from app.db.models import User, BeehiveEvent, BeehiveEnrollment
from app.schemas import (
    BeehiveEventCreate,
    BeehiveEventResponse,
    BeehiveEnrollmentCreate,
    BeehiveEnrollmentResponse
)
from app.deps import get_current_user

router = APIRouter()

@router.post("/events", response_model=BeehiveEventResponse)
def create_beehive_event(
    event: BeehiveEventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can create Beehive events")
    
    new_event = BeehiveEvent(
        organizer_id=current_user.id,
        **event.model_dump()
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/events", response_model=List[BeehiveEventResponse])
def get_beehive_events(
    db: Session = Depends(get_db)
):
    return db.query(BeehiveEvent).filter(BeehiveEvent.is_active == True).options(joinedload(BeehiveEvent.organizer)).all()

@router.post("/events/{event_id}/enroll", response_model=BeehiveEnrollmentResponse)
def enroll_in_beehive_event(
    event_id: int,
    enrollment: BeehiveEnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can enroll in Beehive events")
    
    event = db.query(BeehiveEvent).filter(BeehiveEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Check seats
    current_enrollments = db.query(BeehiveEnrollment).filter(BeehiveEnrollment.event_id == event_id).count()
    if current_enrollments >= event.total_seats:
        raise HTTPException(status_code=400, detail="Event is full")

    # Check existing enrollment
    existing = db.query(BeehiveEnrollment).filter(
        BeehiveEnrollment.event_id == event_id,
        BeehiveEnrollment.student_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    
    new_enrollment = BeehiveEnrollment(
        event_id=event_id,
        student_id=current_user.id,
        payment_status="pending" # In real app, integrate payment gateway here
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

@router.get("/events/{event_id}/enrollments", response_model=List[BeehiveEnrollmentResponse])
def get_event_enrollments(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view enrollments")
        
    return db.query(BeehiveEnrollment).filter(
        BeehiveEnrollment.event_id == event_id
    ).options(joinedload(BeehiveEnrollment.student)).all()
