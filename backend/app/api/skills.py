from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.db.models import Skill, User
from app.schemas import SkillCreate, SkillResponse
from app.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[SkillResponse])
def read_skills(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Skill)
    if search:
        query = query.filter(Skill.name.ilike(f"%{search}%"))
    skills = query.offset(skip).limit(limit).all()
    return skills

@router.post("/", response_model=SkillResponse)
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Allow any authenticated user to add a skill for now, or restrict to admin/mentor
    # Let's allow anyone to grow the skill database for better matching
    
    existing_skill = db.query(Skill).filter(Skill.name.ilike(skill.name)).first()
    if existing_skill:
        return existing_skill
        
    new_skill = Skill(name=skill.name)
    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill
