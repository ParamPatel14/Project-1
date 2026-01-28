from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.db.database import get_db
from app.db.models import User, Opportunity, Assignment, Submission
from app.deps import get_current_user

router = APIRouter()

# Pydantic Models
class AssignmentBase(BaseModel):
    title: str
    description: str
    type: str # code, pdf, analysis
    due_date: Optional[datetime] = None

class AssignmentCreate(AssignmentBase):
    opportunity_id: int

class AssignmentResponse(AssignmentBase):
    id: int
    opportunity_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class SubmissionBase(BaseModel):
    content: Optional[str] = None
    file_url: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionResponse(SubmissionBase):
    id: int
    assignment_id: int
    student_id: int
    submitted_at: datetime
    grade: Optional[float] = None
    feedback: Optional[str] = None
    rubric_scores: Optional[str] = None
    audio_feedback_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class GradeUpdate(BaseModel):
    grade: float
    feedback: Optional[str] = None
    rubric_scores: Optional[str] = None # JSON string
    audio_feedback_url: Optional[str] = None

# Endpoints

@router.post("/", response_model=AssignmentResponse)
def create_assignment(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can create assignments")
    
    opportunity = db.query(Opportunity).filter(Opportunity.id == assignment.opportunity_id).first()
    if not opportunity or opportunity.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized for this opportunity")

    new_assignment = Assignment(
        opportunity_id=assignment.opportunity_id,
        title=assignment.title,
        description=assignment.description,
        type=assignment.type,
        due_date=assignment.due_date
    )
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment

@router.get("/opportunity/{opportunity_id}", response_model=List[AssignmentResponse])
def get_opportunity_assignments(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check access (Mentor owner or accepted student? For now open to auth users)
    return db.query(Assignment).filter(Assignment.opportunity_id == opportunity_id).all()

@router.post("/{assignment_id}/submit", response_model=SubmissionResponse)
def submit_assignment(
    assignment_id: int,
    submission: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can submit assignments")
    
    # Check if assignment exists
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Check if already submitted (optional, maybe allow resubmission)
    existing = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.student_id == current_user.id
    ).first()

    if existing:
        existing.content = submission.content
        existing.file_url = submission.file_url
        existing.submitted_at = datetime.utcnow()
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_submission = Submission(
            assignment_id=assignment_id,
            student_id=current_user.id,
            content=submission.content,
            file_url=submission.file_url
        )
        db.add(new_submission)
        db.commit()
        db.refresh(new_submission)
        return new_submission

@router.get("/{assignment_id}/submissions", response_model=List[SubmissionResponse])
def get_submissions(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    if current_user.role == "mentor":
        # Check ownership
        opp = db.query(Opportunity).filter(Opportunity.id == assignment.opportunity_id).first()
        if opp.mentor_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized")
        return db.query(Submission).filter(Submission.assignment_id == assignment_id).all()
    elif current_user.role == "student":
        return db.query(Submission).filter(
            Submission.assignment_id == assignment_id,
            Submission.student_id == current_user.id
        ).all()
    
    return []

@router.post("/submissions/{submission_id}/grade", response_model=SubmissionResponse)
def grade_submission(
    submission_id: int,
    grade_data: GradeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Only mentors can grade")
    
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Verify mentor owns the opportunity
    assignment = submission.assignment
    opp = assignment.opportunity
    if opp.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    submission.grade = grade_data.grade
    submission.feedback = grade_data.feedback
    submission.rubric_scores = grade_data.rubric_scores
    submission.audio_feedback_url = grade_data.audio_feedback_url
    
    db.commit()
    db.refresh(submission)
    return submission
