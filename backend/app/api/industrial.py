from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from app.db.database import get_db
from app.db.models import User, IndustrialProjectInterest, IndustrialVisit, IndustrialVisitApplication
from app.schemas import (
    IndustrialProjectInterestCreate, 
    IndustrialProjectInterestResponse,
    IndustrialVisitCreate,
    IndustrialVisitResponse,
    IndustrialVisitApplicationCreate,
    IndustrialVisitApplicationResponse
)
from app.deps import get_current_user

router = APIRouter()

# --- Industrial Project Interest ---

@router.post("/interest", response_model=IndustrialProjectInterestResponse)
def create_project_interest(
    interest: IndustrialProjectInterestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit project interests")
    
    new_interest = IndustrialProjectInterest(
        student_id=current_user.id,
        **interest.model_dump()
    )
    db.add(new_interest)
    db.commit()
    db.refresh(new_interest)
    return new_interest

@router.get("/interest", response_model=List[IndustrialProjectInterestResponse])
def get_project_interests(
    student_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(IndustrialProjectInterest)
    
    # Students can only see their own
    if current_user.role == "student":
        query = query.filter(IndustrialProjectInterest.student_id == current_user.id)
    # Admins/Mentors can filter by student_id or see all
    elif student_id:
        query = query.filter(IndustrialProjectInterest.student_id == student_id)
        
    return query.all()

# --- Industrial Visits ---

@router.post("/visits", response_model=IndustrialVisitResponse)
def create_industrial_visit(
    visit: IndustrialVisitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["admin", "mentor"]:
        raise HTTPException(status_code=403, detail="Only admins and mentors can create industrial visits")
    
    new_visit = IndustrialVisit(
        organizer_id=current_user.id,
        **visit.model_dump()
    )
    db.add(new_visit)
    db.commit()
    db.refresh(new_visit)
    return new_visit

@router.get("/visits", response_model=List[IndustrialVisitResponse])
def get_industrial_visits(
    db: Session = Depends(get_db)
):
    return db.query(IndustrialVisit).options(joinedload(IndustrialVisit.organizer)).all()

@router.post("/visits/{visit_id}/apply", response_model=IndustrialVisitApplicationResponse)
def apply_for_visit(
    visit_id: int,
    application: IndustrialVisitApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can apply for industrial visits")
    
    visit = db.query(IndustrialVisit).filter(IndustrialVisit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
        
    # Check if already applied
    existing = db.query(IndustrialVisitApplication).filter(
        IndustrialVisitApplication.visit_id == visit_id,
        IndustrialVisitApplication.student_id == current_user.id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied for this visit")
    
    new_application = IndustrialVisitApplication(
        visit_id=visit_id,
        student_id=current_user.id,
        statement_of_purpose=application.statement_of_purpose
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return new_application

@router.get("/visits/{visit_id}/applications", response_model=List[IndustrialVisitApplicationResponse])
def get_visit_applications(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    visit = db.query(IndustrialVisit).filter(IndustrialVisit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
        
    if current_user.role == "student" and current_user.id != visit.organizer_id:
         raise HTTPException(status_code=403, detail="Not authorized to view applications")

    return db.query(IndustrialVisitApplication).filter(
        IndustrialVisitApplication.visit_id == visit_id
    ).options(joinedload(IndustrialVisitApplication.student)).all()

@router.put("/applications/{application_id}/status", response_model=IndustrialVisitApplicationResponse)

