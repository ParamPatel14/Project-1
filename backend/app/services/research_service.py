import logging
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import models
from app.services import ai_service
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class ResearchService:
    
    @staticmethod
    async def ingest_publications(db: Session, mentor_id: int):
        """
        Simulates ingestion of publications for a mentor.
        """
        mentor = db.query(models.MentorProfile).filter(models.MentorProfile.id == mentor_id).first()
        if not mentor:
            raise ValueError("Mentor not found")
            
        # Check if already has pubs
        existing_count = db.query(models.Publication).filter(models.Publication.mentor_profile_id == mentor_id).count()
        if existing_count > 0:
            logger.info(f"Mentor {mentor_id} already has {existing_count} publications. Skipping ingestion.")
            return
            
        # Generate simulated pubs
        logger.info(f"Generating publications for mentor {mentor_id}...")
        pubs_data = await ai_service.generate_simulated_publications(
            mentor_name=mentor.user.name if mentor.user else "Professor",
            research_areas=mentor.research_areas,
            bio=mentor.bio
        )
        
        for p in pubs_data:
            pub = models.Publication(
                mentor_profile_id=mentor_id,
                title=p.get("title"),
                description=p.get("abstract"),
                publication_date=str(p.get("year")),
                journal_conference=p.get("journal"),
                citation_count=p.get("citation_count", 0)
            )
            db.add(pub)
        
        db.commit()
        logger.info(f"Ingested {len(pubs_data)} publications for mentor {mentor_id}")

    @staticmethod
    async def analyze_trends(db: Session, mentor_id: int):
        """
        Analyzes publications to extract topics and compute trends.
        """
        mentor = db.query(models.MentorProfile).filter(models.MentorProfile.id == mentor_id).first()
        if not mentor:
            raise ValueError("Mentor not found")
            
        # 1. Fetch Publications
        pubs = db.query(models.Publication).filter(models.Publication.mentor_profile_id == mentor_id).all()
        if not pubs:
            logger.warning("No publications found for analysis")
            return
            
        abstracts = [p.description for p in pubs if p.description]
        
        # 2. Extract Topics (AI)
        topic_names = await ai_service.extract_research_topics(abstracts)
        
        # 3. Link Topics & Compute Trends
        # Clear existing trends for re-analysis
        db.query(models.MentorTopicTrend).filter(models.MentorTopicTrend.mentor_id == mentor_id).delete()
        db.commit()
        
        for topic_name in topic_names:
            # Get or Create Topic
            topic = db.query(models.ResearchTopic).filter(models.ResearchTopic.name == topic_name).first()
            if not topic:
                topic = models.ResearchTopic(name=topic_name)
                db.add(topic)
                db.commit()
                db.refresh(topic)
                
            # Link papers to this topic (Simple keyword match in abstract/title)
            # In a real system, we'd use embedding similarity or AI classification
            topic_years = []
            
            for pub in pubs:
                text = (pub.title + " " + (pub.description or "")).lower()
                if topic_name.lower() in text:
                    # Link it
                    # Check if link exists
                    link = db.query(models.PublicationTopic).filter(
                        models.PublicationTopic.publication_id == pub.id,
                        models.PublicationTopic.topic_id == topic.id
                    ).first()
                    
                    if not link:
                        link = models.PublicationTopic(publication_id=pub.id, topic_id=topic.id)
                        db.add(link)
                    
                    try:
                        year = int(pub.publication_date[:4])
                        topic_years.append(year)
                    except:
                        pass
            
            # Compute Trend Stats
            if topic_years:
                from collections import Counter
                counts = Counter(topic_years)
                total_count = len(topic_years)
                last_active = max(topic_years)
                
                # Simple Trend Logic
                # Compare recent (last 3 years) vs previous
                current_year = 2025
                recent_count = sum(c for y, c in counts.items() if y >= current_year - 3)
                old_count = total_count - recent_count
                
                status = "Stable"
                if recent_count > old_count * 1.5: # Arbitrary threshold
                    status = "Rising"
                elif recent_count == 0:
                    status = "Declining"
                
                # Save Trend Summary
                trend = models.MentorTopicTrend(
                    mentor_id=mentor_id,
                    topic_id=topic.id,
                    trend_status=status,
                    total_count=total_count,
                    last_active_year=last_active
                )
                db.add(trend)
                
        db.commit()
        logger.info(f"Analysis complete for mentor {mentor_id}")

    @staticmethod
    def get_mentor_analytics(db: Session, mentor_id: int):
        """
        Returns structured analytics data for the frontend.
        """
        trends = db.query(models.MentorTopicTrend).filter(
            models.MentorTopicTrend.mentor_id == mentor_id
        ).order_by(models.MentorTopicTrend.total_count.desc()).limit(5).all()
        
        return [
            {
                "topic": t.topic.name,
                "status": t.trend_status,
                "count": t.total_count,
                "last_active": t.last_active_year
            }
            for t in trends
        ]

    @staticmethod
    async def generate_gaps_for_pair(db: Session, mentor_id: int, student_id: int) -> List[Dict[str, Any]]:
        """
        Generates research gaps for a specific student-mentor pair.
        """
        mentor = db.query(models.MentorProfile).filter(models.MentorProfile.id == mentor_id).first()
        student = db.query(models.StudentProfile).filter(models.StudentProfile.id == student_id).first()
        
        if not mentor or not student:
            raise ValueError("Mentor or Student not found")
            
        # 1. Gather Context
        # Mentor's top domains (from trends)
        top_trends = db.query(models.MentorTopicTrend).filter(
            models.MentorTopicTrend.mentor_id == mentor_id
        ).order_by(models.MentorTopicTrend.total_count.desc()).limit(5).all()
        mentor_domains = [t.topic.name for t in top_trends]
        if not mentor_domains and mentor.research_areas:
             mentor_domains = [area.strip() for area in mentor.research_areas.split(',')]
        
        # Mentor's Abstracts
        pubs = db.query(models.Publication).filter(models.Publication.mentor_profile_id == mentor_id).order_by(models.Publication.publication_date.desc()).limit(10).all()
        mentor_abstracts = [f"Title: {p.title}\nAbstract: {p.description}" for p in pubs]
        
        # Student's Skills
        student_skills = []
        if student.primary_skills:
            try:
                # Try JSON
                import json
                student_skills = json.loads(student.primary_skills)
            except:
                # Fallback to CSV
                student_skills = [s.strip() for s in student.primary_skills.split(',')]
        
        if not student_skills:
            # Fallback to interests if no skills
             if student.interests:
                 student_skills = [s.strip() for s in student.interests.split(',')]
        
        # 2. Call AI Service
        gaps = await ai_service.generate_research_gaps(
            mentor_name=mentor.user.name,
            mentor_domains=mentor_domains,
            student_skills=student_skills,
            mentor_abstracts=mentor_abstracts
        )
        
        return gaps
