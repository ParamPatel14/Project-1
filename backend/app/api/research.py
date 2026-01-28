from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.db.database import get_db
from app.db.models import User, Opportunity, PublicationProject
from app.deps import get_current_user

router = APIRouter()

class ProjectCreate(BaseModel):
    title: str
    opportunity_id: Optional[int] = None
    student_id: int # Mentor creates for student, or student creates for self? Let's say Mentor assigns or Student starts.

class ProjectUpdate(BaseModel):
    status: str # Kanban column
    title: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    status: str
    student_id: int
    mentor_id: int
    opportunity_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.post("/", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Logic: Who can create? 
    # Let's say Mentor creates for a student they accepted.
    if current_user.role != "mentor":
         raise HTTPException(status_code=403, detail="Only mentors can start research projects")
         
    new_project = PublicationProject(
        title=project.title,
        student_id=project.student_id,
        mentor_id=current_user.id,
        opportunity_id=project.opportunity_id,
        status="Ideation"
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/my", response_model=List[ProjectResponse])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "mentor":
        return db.query(PublicationProject).filter(PublicationProject.mentor_id == current_user.id).all()
    else:
        return db.query(PublicationProject).filter(PublicationProject.student_id == current_user.id).all()

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project_status(
    project_id: int,
    update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(PublicationProject).filter(PublicationProject.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Check auth
    if current_user.id not in [project.mentor_id, project.student_id]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if update.status:
        project.status = update.status
    if update.title:
        project.title = update.title
        
    project.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(project)
    return project
