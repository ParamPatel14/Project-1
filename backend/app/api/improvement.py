from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.db.database import get_db
from app.db.models import User, Opportunity, ImprovementPlan, PlanItem, OpportunitySkill, Skill
from app.api.auth import get_current_user

router = APIRouter()

# Pydantic Models
class PlanItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: str
    status: str
    evidence_link: Optional[str] = None

class PlanItemUpdate(BaseModel):
    status: Optional[str] = None
    evidence_link: Optional[str] = None

class PlanItemResponse(PlanItemBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class ImprovementPlanResponse(BaseModel):
    id: int
    opportunity_id: int
    opportunity_title: str
    status: str
    created_at: datetime
    items: List[PlanItemResponse]

    class Config:
        orm_mode = True

# Endpoints

@router.post("/generate/{opportunity_id}", response_model=ImprovementPlanResponse)
def generate_improvement_plan(
    opportunity_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can generate improvement plans")

    # Check if plan already exists
    existing_plan = db.query(ImprovementPlan).filter(
        ImprovementPlan.student_id == current_user.id,
        ImprovementPlan.opportunity_id == opportunity_id
    ).first()
    
    if existing_plan:
        return _format_plan_response(existing_plan)

    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # Create Plan
    new_plan = ImprovementPlan(
        student_id=current_user.id,
        opportunity_id=opportunity_id,
        status="in_progress"
    )
    db.add(new_plan)
    db.flush() # Get ID

    # Generate Items
    
    # 1. Skill Gaps
    user_skill_ids = [s.id for s in current_user.skills]
    missing_skills = []
    for op_skill in opportunity.required_skills:
        if op_skill.skill_id not in user_skill_ids:
            missing_skills.append(op_skill)
    
    for ms in missing_skills:
        item = PlanItem(
            plan_id=new_plan.id,
            title=f"Learn {ms.skill.name}",
            description=f"This skill is required (Weight: {ms.weight}). Find resources and complete a small project using {ms.skill.name}.",
            type="skill_gap",
            status="pending"
        )
        db.add(item)

    # 2. Mini-Project (Generic for now)
    db.add(PlanItem(
        plan_id=new_plan.id,
        title="Complete a Relevant Mini-Project",
        description=f"Build a small project demonstrating skills relevant to {opportunity.title}. Upload code to GitHub.",
        type="mini_project",
        status="pending"
    ))

    # 3. Reading List
    db.add(PlanItem(
        plan_id=new_plan.id,
        title="Background Reading",
        description="Read 2-3 key papers or articles related to this research area.",
        type="reading_list",
        status="pending"
    ))

    # 4. SOP Structure
    db.add(PlanItem(
        plan_id=new_plan.id,
        title="Draft Statement of Purpose",
        description="Write a draft explaining why you are a good fit, addressing your skill gaps and how you are closing them.",
        type="sop",
        status="pending"
    ))

    db.commit()
    db.refresh(new_plan)
    return _format_plan_response(new_plan)

@router.get("/", response_model=List[ImprovementPlanResponse])
def get_my_plans(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plans = db.query(ImprovementPlan).filter(ImprovementPlan.student_id == current_user.id).all()
    return [_format_plan_response(p) for p in plans]

@router.get("/{plan_id}", response_model=ImprovementPlanResponse)
def get_plan(
    plan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan = db.query(ImprovementPlan).filter(ImprovementPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    
    if plan.student_id != current_user.id and plan.opportunity.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this plan")
        
    return _format_plan_response(plan)

@router.put("/item/{item_id}", response_model=PlanItemResponse)
def update_plan_item(
    item_id: int,
    update: PlanItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(PlanItem).filter(PlanItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    if item.plan.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this item")
        
    if update.status:
        item.status = update.status
    if update.evidence_link is not None:
        item.evidence_link = update.evidence_link
        
    db.commit()
    db.refresh(item)
    return item

@router.get("/mentor/{opportunity_id}", response_model=List[ImprovementPlanResponse])
def get_plans_for_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    if opportunity.mentor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view plans for this opportunity")
        
    plans = db.query(ImprovementPlan).filter(ImprovementPlan.opportunity_id == opportunity_id).all()
    return [_format_plan_response(p) for p in plans]

def _format_plan_response(plan):
    # Helper to format response since Pydantic's orm_mode might need help with nested relationships sometimes
    # or just to be safe with the opportunity title
    return {
        "id": plan.id,
        "opportunity_id": plan.opportunity_id,
        "opportunity_title": plan.opportunity.title,
        "status": plan.status,
        "created_at": plan.created_at,
        "items": plan.items
    }
