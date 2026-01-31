from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.db.models import User, Opportunity, Application, Certificate, PublicationProject
from app.deps import get_current_user

router = APIRouter()

@router.get("/dashboard")
def get_analytics_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Determine scope based on user role
    if current_user.role == "mentor":
        # Mentor-specific analytics
        total_opportunities = db.query(Opportunity).filter(Opportunity.mentor_id == current_user.id).count()
        
        # Applications to this mentor's opportunities
        total_applications = db.query(Application).join(Opportunity).filter(Opportunity.mentor_id == current_user.id).count()
        
        # Unique students who applied to this mentor
        total_students = db.query(Application.student_id).join(Opportunity).filter(Opportunity.mentor_id == current_user.id).distinct().count()
        
        # Mentor isn't tracking other mentors
        total_mentors = 0
        
        # Research projects
        active_projects = db.query(PublicationProject).filter(
            PublicationProject.mentor_id == current_user.id, 
            PublicationProject.status != "Published"
        ).count()
        
        published_projects = db.query(PublicationProject).filter(
            PublicationProject.mentor_id == current_user.id, 
            PublicationProject.status == "Published"
        ).count()
        
        # Certificates issued by this mentor
        certificates_issued = db.query(Certificate).filter(Certificate.mentor_id == current_user.id).count()
        
        # Funding for this mentor's opportunities
        total_funding = db.query(func.sum(Opportunity.funding_amount)).filter(Opportunity.mentor_id == current_user.id).scalar() or 0.0
        
    else:
        # Admin / Platform-wide analytics (Default for Admin)
        total_students = db.query(User).filter(User.role == "student").count()
        total_mentors = db.query(User).filter(User.role == "mentor").count()
        total_opportunities = db.query(Opportunity).count()
        total_applications = db.query(Application).count()
        active_projects = db.query(PublicationProject).filter(PublicationProject.status != "Published").count()
        published_projects = db.query(PublicationProject).filter(PublicationProject.status == "Published").count()
        certificates_issued = db.query(Certificate).count()
        
        # Funding Stats
        total_funding = db.query(func.sum(Opportunity.funding_amount)).scalar() or 0.0
    
    return {
        "users": {
            "students": total_students,
            "mentors": total_mentors
        },
        "engagement": {
            "opportunities": total_opportunities,
            "applications": total_applications,
            "certificates": certificates_issued
        },
        "research": {
            "active": active_projects,
            "published": published_projects
        },
        "funding": {
            "total_committed": total_funding,
            "currency": "USD"
        }
    }
