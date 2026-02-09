import google.generativeai as genai
from app.core.config import settings
import json
import logging
from datetime import datetime, timedelta

# Configure logging
logger = logging.getLogger(__name__)

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

# Use Gemini 1.5 Flash
MODEL_NAME = "gemini-2.5-flash" 

def get_model():
    if not settings.GEMINI_API_KEY:
        raise Exception("GEMINI_API_KEY is not set in the environment variables.")
    return genai.GenerativeModel(MODEL_NAME)

async def analyze_match(resume_text: str, job_description: str) -> dict:
    """
    Analyzes the match between a resume and a job description.
    Returns a dictionary with score, missing_skills, and explanation.
    """
    try:
        model = get_model()
        
        prompt = f"""
        You are an expert ATS and Recruiter. Compare the following Resume against the Job Description.
        
        Job Description:
        {job_description}
        
        Resume:
        {resume_text}
        
        Provide a detailed analysis in JSON format with the following keys:
        - "score": A number between 0 and 100 representing the match percentage.
        - "missing_skills": A list of key skills or qualifications mentioned in the JD but missing in the Resume.
        - "explanation": A concise explanation (max 3 sentences) of why the score is what it is, highlighting the main gaps or strengths.
        
        Output ONLY the JSON.
        """
        
        response = model.generate_content(prompt)
        
        # Clean up response text to ensure it's valid JSON
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)
        
    except Exception as e:
        logger.error(f"Error in analyze_match: {str(e)}")
        # Return a fallback error response
        if "GEMINI_API_KEY is not set" in str(e):
             return {
                "score": 0,
                "missing_skills": ["API Key Missing"],
                "explanation": "Please add GEMINI_API_KEY to your .env file to enable AI features."
            }
        
        return {
            "score": 0,
            "missing_skills": ["Error analyzing match"],
            "explanation": "Could not analyze match due to an internal error."
        }

async def generate_improvement_plan(resume_text: str, job_description: str, days_remaining: int) -> list:
    """
    Generates a detailed, step-by-step improvement plan based on the resume and job description.
    Returns a list of plan items with estimated hours and deadlines.
    """
    try:
        model = get_model()
        
        prompt = f"""
        You are a supportive mentor helping a student prepare for an internship. 
        Analyze the student's resume and the target opportunity.
        Create a manageable, motivating improvement plan to be completed in {days_remaining} days.

        Job Description:
        {job_description}
        
        Resume:
        {resume_text}
        
        CRITICAL INSTRUCTIONS:
        1. Keep it DOABLE: The total workload for the entire plan should be between 20-30 hours maximum.
        2. Audience: This is for an Intern/Junior role. Avoid complex senior-level architectural tasks.
        3. Focus: Identify only the top 3-5 most critical skill gaps. Do not overwhelm the student.
        4. Tone: Encouraging and practical.
        5. Tasks: specific, small, and "quick wins" (e.g., "Build a simple API endpoint" rather than "Architect a distributed system").
        
        Output a JSON ARRAY of objects with the following keys:
        - "title": Short, actionable title (e.g., "Create a simple React Form").
        - "description": specific instructions on what to do.
        - "type": One of ["skill_gap", "mini_project", "reading_list", "sop"].
        - "estimated_hours": String (keep individual tasks short, e.g. "2-4 hours").
        - "deadline_day_offset": Integer (days from now, distributed evenly over {days_remaining} days).
        - "priority": One of ["high", "medium", "low"].
        
        Output ONLY the JSON ARRAY.
        """
        
        response = model.generate_content(prompt)
        
        # Clean up response text to ensure it's valid JSON
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)
        
    except Exception as e:
        logger.error(f"Error in generate_improvement_plan: {str(e)}")
        return []

async def generate_cover_letter(resume_text: str, job_description: str) -> str:
    """
    Generates a custom cover letter based on the resume and job description.
    """
    try:
        model = get_model()
        
        prompt = f"""
        You are a professional career coach. Write a compelling, personalized cover letter for the candidate based on their Resume and the Job Description below.
        
        Job Description:
        {job_description}
        
        Resume:
        {resume_text}
        
        The cover letter should:
        1. Be professional and engaging.
        2. Highlight relevant experiences from the resume that match the JD.
        3. Address the specific company and role.
        4. Not use placeholders like "[Your Name]" if the name is available in the resume. If not, use generic placeholders.
        
        Output ONLY the cover letter text.
        """
        
        response = model.generate_content(prompt)
        return response.text.strip()
        
    except Exception as e:
        logger.error(f"Error in generate_cover_letter: {str(e)}")
        if "GEMINI_API_KEY is not set" in str(e):
             return "Please add GEMINI_API_KEY to your .env file to enable AI features."
        return "Error generating cover letter. Please try again later."

async def get_embedding(text: str) -> list:
    """
    Generates a vector embedding for the given text using Gemini.
    """
    if not text:
        return []
    try:
        if not settings.GEMINI_API_KEY:
             # Return a dummy zero vector if no API key (for dev/testing without key)
             # In production, this should raise an error or be handled
             logger.warning("GEMINI_API_KEY not set. Returning dummy embedding.")
             return [0.0] * 768 

        # Use the embedding model
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document",
            title="Matching Embedding"
        )
        return result['embedding']
    except Exception as e:
        logger.error(f"Error in get_embedding: {str(e)}")
        return [0.0] * 768 # Fallback

async def generate_simulated_publications(mentor_name: str, research_areas: str, bio: str) -> list:
    """
    Generates a list of simulated recent publications for a mentor based on their profile.
    Used for the 'Ingestion' phase demo to populate the database with realistic data.
    """
    try:
        model = get_model()
        
        prompt = f"""
        You are a research database simulator. Generate 10-15 realistic academic publication records for a professor named {mentor_name}.
        
        Professor Profile:
        - Research Areas: {research_areas}
        - Bio: {bio}
        
        Constraints:
        1. Years: 2019 to 2025 (inclusive).
        2. Titles: Academic, technical, and plausible for their field.
        3. Abstracts: 2-3 sentences summarizing the paper.
        4. Citation Count: Random integer between 0 and 150 (skewed lower for recent papers).
        5. Trends: Show a progression or evolution in topics over the years if possible.
        
        Output a JSON ARRAY of objects with:
        - "title": str
        - "abstract": str
        - "year": int
        - "citation_count": int
        - "journal": str (e.g., "NeurIPS 2023", "Nature Medicine", "IEEE Transactions")
        
        Output ONLY the JSON ARRAY.
        """
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)
    except Exception as e:
        logger.error(f"Error in generate_simulated_publications: {str(e)}")
        return []

async def extract_research_topics(abstracts: list[str]) -> list[str]:
    """
    Extracts high-level research topics from a list of abstracts.
    """
    try:
        model = get_model()
        
        # Limit input size to avoid token limits, take first 50 abstracts or just concat first 2000 chars
        combined_text = "\n\n".join(abstracts[:20]) 
        
        prompt = f"""
        Analyze the following research abstracts and identify the top 5-7 distinct research topics/themes.
        
        Abstracts:
        {combined_text[:10000]}
        
        Output a JSON ARRAY of strings, e.g., ["Graph Neural Networks", "Clinical Decision Support", "Explainable AI"].
        Keep topics specific but broad enough to categorize multiple papers.
        
        Output ONLY the JSON ARRAY.
        """
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)
    except Exception as e:
        logger.error(f"Error in extract_research_topics: {str(e)}")
        return []

async def generate_research_gaps(mentor_name: str, mentor_domains: list[str], student_skills: list[str], mentor_abstracts: list[str]) -> list:
    """
    Identifies research gaps by combining mentor domains with student skills (method-domain gaps).
    """
    try:
        model = get_model()
        
        # Context preparation
        domains_str = ", ".join(mentor_domains)
        skills_str = ", ".join(student_skills)
        abstracts_context = "\n".join(mentor_abstracts[:5]) # Use top 5 recent abstracts for context
        
        prompt = f"""
        You are a PhD Research Advisor. Your goal is to suggest 3 novel "Research Gaps" for a student applying to Professor {mentor_name}'s lab.
        
        Context:
        - Mentor's Active Research Domains: {domains_str}
        - Student's Key Skills (Methods/Tools): {skills_str}
        - Mentor's Recent Work (Abstracts):
        {abstracts_context}
        
        Task:
        Identify 3 "Method-Domain" gaps where the student's skills (Methods) can be applied to the Mentor's Domains in a way that is:
        1. Novel (Under-explored in the provided abstracts).
        2. Feasible for the student.
        3. Aligned with the mentor's general direction.
        
        Output a JSON ARRAY of objects with:
        - "title": Catchy, academic title for the research direction.
        - "description": Plain-English description of the gap.
        - "type": "method_domain_gap".
        - "why_gap": Why is this a gap? (e.g., "Common in Domain X but rarely using Method Y").
        - "reason_student": Why it fits the student (skills).
        - "reason_mentor": Why it fits the mentor (domain alignment).
        - "feasibility_score": Integer (0-100).
        - "confidence_score": Integer (0-100).
        - "related_papers": List of 2-3 existing real or plausible paper titles that hint at this direction but don't fully solve it.
        
        Output ONLY the JSON ARRAY.
        """
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)
    except Exception as e:
        logger.error(f"Error in generate_research_gaps: {str(e)}")
        return []

async def generate_proposal_guidance(student_profile: dict, mentor_profile: dict, research_gap: dict) -> dict:
    """
    Generates structured proposal guidance, supervisor talking points, and a readiness check.
    """
    try:
        model = get_model()

        student_context = f"""
        Skills: {', '.join(student_profile.get('skills', []))}
        Degree: {student_profile.get('degree', 'N/A')}
        Major: {student_profile.get('major', 'N/A')}
        Bio: {student_profile.get('bio', 'N/A')}
        """

        mentor_context = f"""
        Name: {mentor_profile.get('name', 'N/A')}
        Research Areas: {mentor_profile.get('research_areas', 'N/A')}
        """

        gap_context = f"""
        Gap Title: {research_gap.get('title', 'N/A')}
        Gap Description: {research_gap.get('description', 'N/A')}
        """

        prompt = f"""
        You are a PhD Application Strategist. Help a student prepare a research proposal direction for a specific mentor.

        Student Profile:
        {student_context}

        Mentor Profile:
        {mentor_context}

        Target Research Gap:
        {gap_context}

        Task:
        Break the application into small, clear, honest steps. No automation pretending to "guarantee admission".

        Generate a JSON object with the following keys:
        1. "proposal_direction": A structured object containing:
           - "problem_statement": Derived from the research gap.
           - "why_it_matters": Societal/Academic relevance.
           - "missing_current_research": What is missing.
           - "methodology": High-level approach (no equations).
           - "expected_contribution": Expected outcome.
        
        2. "talking_points": An array of strings.
           - Respectful, realistic, non-pushy points to discuss with the supervisor.
           - Example: "Mention interest in clinical decision systems", "Highlight lack of explainability", "Propose initial exploration".

        3. "readiness_check": A structured object containing:
           - "score": Integer (0-100).
           - "breakdown": Object with keys "skill_alignment", "background_match", "gap_complexity", "data_feasibility" (Values: "Low", "Medium", "High").
           - "suggestions": List of specific actions to improve readiness (e.g., "Improve statistics basics", "Read 5 more papers").

        Output ONLY the JSON object.
        """

        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]

        return json.loads(text)

    except Exception as e:
        logger.error(f"Error in generate_proposal_guidance: {str(e)}")
        return {
            "proposal_direction": {
                "problem_statement": "Error generating guidance.",
                "why_it_matters": "",
                "missing_current_research": "",
                "methodology": "",
                "expected_contribution": ""
            },
            "talking_points": ["Error generating talking points."],
            "readiness_check": {
                "score": 0,
                "breakdown": {},
                "suggestions": ["Please try again later."]
            }
        }
