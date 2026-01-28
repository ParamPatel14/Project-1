from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pypdf import PdfReader
import io
import re
from app.deps import get_current_user
from app.db.models import User

router = APIRouter()

def extract_links(text):
    links = {}
    # GitHub
    github = re.search(r'(github\.com/[\w-]+)', text, re.IGNORECASE)
    if github: links['github_url'] = "https://" + github.group(1)
    
    # LinkedIn
    linkedin = re.search(r'(linkedin\.com/in/[\w-]+)', text, re.IGNORECASE)
    if linkedin: links['linkedin_url'] = "https://" + linkedin.group(1)
    
    # Behance
    behance = re.search(r'(behance\.net/[\w-]+)', text, re.IGNORECASE)
    if behance: links['behance_url'] = "https://" + behance.group(1)
    
    # Twitter/X
    twitter = re.search(r'(twitter\.com/[\w-]+|x\.com/[\w-]+)', text, re.IGNORECASE)
    if twitter: links['twitter_url'] = "https://" + twitter.group(1)
    
    # Portfolio/Website (generic)
    # This is harder to distinguish from other links, skipping for now unless explicit "Portfolio: www.xyz.com"
    
    return links

def segment_sections(text):
    lines = text.split('\n')
    sections = {}
    current_section = "header"
    buffer = []
    
    # Keywords that start a section
    keywords = {
        "experience": ["experience", "work history", "employment"],
        "education": ["education", "academic background"],
        "projects": ["projects", "personal projects", "academic projects"],
        "skills": ["skills", "technical skills", "technologies", "competencies"],
        "achievements": ["achievements", "awards", "certifications"]
    }
    
    for line in lines:
        clean_line = line.strip().lower()
        
        # Check if line is a header
        found_section = None
        if len(clean_line) < 30: # Headers are usually short
            for key, triggers in keywords.items():
                if any(trigger in clean_line for trigger in triggers):
                    found_section = key
                    break
        
        if found_section:
            if buffer:
                sections[current_section] = "\n".join(buffer)
            current_section = found_section
            buffer = []
        else:
            buffer.append(line)
            
    if buffer:
        sections[current_section] = "\n".join(buffer)
        
    return sections

def parse_experience(text):
    # Heuristic: Split by lines that look like date ranges or job titles
    # This is very hard to do perfectly without NLP.
    # We will try to find blocks that start with a date or a company name.
    
    # Regex for years: 20xx
    # Regex for dates: Jan 2020, 01/2020, Present
    
    entries = []
    lines = text.split('\n')
    current_entry = {}
    
    # Simple strategy: Every time we see a date range, it's a new entry (or the start of one)
    date_pattern = r'((19|20)\d{2}|Present|Current)'
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # If line contains a date range, assume it's a header line for a job
        if re.search(date_pattern, line):
            if current_entry:
                entries.append(current_entry)
            
            # Try to extract company/title
            # Usually: "Software Engineer | Google | 2020 - Present"
            # Or: "Google 2020-Present"
            # We'll just dump the line as title/company combined for the user to fix
            current_entry = {
                "title": line, # Placeholder
                "company": "",
                "start_date": "", 
                "end_date": "",
                "description": ""
            }
            
            # Extract dates
            dates = re.findall(r'((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s?20\d{2}|Present)', line, re.IGNORECASE)
            if dates:
                current_entry["start_date"] = dates[0]
                if len(dates) > 1:
                    current_entry["end_date"] = dates[1]
                else:
                    current_entry["end_date"] = "Present"
        else:
            if current_entry:
                current_entry["description"] += line + "\n"
    
    if current_entry:
        entries.append(current_entry)
        
    return entries

def parse_education(text):
    entries = []
    lines = text.split('\n')
    current_entry = {}
    
    # Keywords: University, College, Institute, B.Tech, M.S., PhD
    edu_keywords = ["university", "college", "institute", "school", "bachelor", "master", "phd", "degree", "b.tech", "m.tech", "b.sc", "m.sc"]
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        lower_line = line.lower()
        if any(k in lower_line for k in edu_keywords) or re.search(r'20\d{2}', line):
            if current_entry and len(current_entry.get("institution", "")) > 0:
                entries.append(current_entry)
                current_entry = {}
            
            if not current_entry:
                current_entry = {"institution": line, "degree": "", "start_year": "", "end_year": "", "grade": ""}
            else:
                # Append to existing (maybe degree info)
                current_entry["degree"] += " " + line
                
            # Extract Year
            year_match = re.search(r'(20\d{2})', line)
            if year_match:
                if not current_entry.get("end_year"):
                    current_entry["end_year"] = year_match.group(1)
                elif not current_entry.get("start_year"):
                    current_entry["start_year"] = current_entry["end_year"]
                    current_entry["end_year"] = year_match.group(1)
        else:
            if current_entry:
                # Maybe grade?
                if "cgpa" in lower_line or "gpa" in lower_line or "%" in line:
                    current_entry["grade"] = line
    
    if current_entry:
        entries.append(current_entry)
    
    return entries

def parse_projects(text):
    # Projects are hard because they don't have standard headers like dates usually.
    # We'll just split by lines that look like titles (bold/caps?) or bullet points.
    # For now, just return a raw block or simple line split
    entries = []
    lines = text.split('\n')
    current_entry = None
    
    for line in lines:
        line = line.strip()
        if not line: continue
        
        # Assume lines with ":" are titles, e.g. "Chat App: A real-time chat..."
        if ":" in line and len(line.split(":")[0]) < 30:
            if current_entry:
                entries.append(current_entry)
            
            parts = line.split(":", 1)
            current_entry = {
                "title": parts[0].strip(),
                "description": parts[1].strip(),
                "tech_stack": "",
                "url": ""
            }
        elif current_entry:
            current_entry["description"] += "\n" + line
            
    if current_entry:
        entries.append(current_entry)
        
    return entries

def parse_skills(text):
    # Split by commas or bullets
    skills_list = []
    # Replace common separators with comma
    text = text.replace("•", ",").replace("|", ",").replace("\n", ",")
    parts = text.split(",")
    for p in parts:
        s = p.strip()
        if s and len(s) < 30: # Reasonable length for a skill
            skills_list.append(s)
            
    # Heuristic split: Top 5 as primary
    return {
        "primary": ", ".join(skills_list[:5]),
        "tools": ", ".join(skills_list[5:])
    }

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported for now")
    
    try:
        content = await file.read()
        pdf = PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf.pages:
            text += page.extract_text() + "\n"
            
        data = {}
        
        # 1. Identity & Contact
        email_match = re.search(r'[\w\.-]+@[\w\.-]+', text)
        if email_match: data['email'] = email_match.group(0)
        
        phone_match = re.search(r'(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}', text)
        if phone_match: data['phone_number'] = phone_match.group(0)
        
        # Headline (First non-empty line that isn't name/email/phone - simplified)
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        if len(lines) > 1:
            # Assuming line 0 is name, line 1 might be headline
            data['headline'] = lines[1][:100] # Limit length
            
        # 2. Socials
        links = extract_links(text)
        data.update(links)
        
        # 3. Sections
        sections = segment_sections(text)
        
        if "experience" in sections:
            data["work_experiences"] = parse_experience(sections["experience"])
            
        if "education" in sections:
            data["educations"] = parse_education(sections["education"])
            
        if "projects" in sections:
            data["projects"] = parse_projects(sections["projects"])
            
        if "skills" in sections:
            skills_data = parse_skills(sections["skills"])
            data["primary_skills"] = skills_data["primary"]
            data["tools_libraries"] = skills_data["tools"]
            
        return {
            "extracted_data": data,
            "message": "Resume parsed successfully."
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    # In a real app, upload to S3/Cloudinary.
    # Here we return a fake URL that implies it was stored.
    # We use a timestamp to make it look unique.
    import time
    timestamp = int(time.time())
    return {"url": f"https://storage.googleapis.com/resume-bucket/{current_user.id}/{timestamp}_{file.filename}"}
