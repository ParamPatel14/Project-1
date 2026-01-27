from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, List
from enum import Enum

class RoleEnum(str, Enum):
    student = "student"
    mentor = "mentor"
    admin = "admin"

# --- Shared ---
class SkillBase(BaseModel):
    name: str

class SkillCreate(SkillBase):
    pass

class SkillResponse(SkillBase):
    id: int
    class Config:
        from_attributes = True

# --- Student Profile Schemas ---
class StudentProfileBase(BaseModel):
    university: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    bio: Optional[str] = None
    github_url: Optional[str] = None # Pydantic v2 uses HttpUrl, keeping str for simplicity or validation
    scholar_url: Optional[str] = None
    website_url: Optional[str] = None
    intro_video_url: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    pass

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfileResponse(StudentProfileBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# --- Mentor Profile Schemas ---
class MentorProfileBase(BaseModel):
    lab_name: Optional[str] = None
    university: Optional[str] = None
    position: Optional[str] = None
    research_areas: Optional[str] = None
    bio: Optional[str] = None
    website_url: Optional[str] = None

class MentorProfileCreate(MentorProfileBase):
    pass

class MentorProfileUpdate(MentorProfileBase):
    pass

class MentorProfileResponse(MentorProfileBase):
    id: int
    user_id: int
    is_verified: bool
    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    name: Optional[str] = None
    role: RoleEnum # Enforce role selection at signup

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    name: Optional[str] = None
    role: str
    provider: str
    is_active: bool
    
    # Optional nested profiles
    student_profile: Optional[StudentProfileResponse] = None
    mentor_profile: Optional[MentorProfileResponse] = None
    skills: List[SkillResponse] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
