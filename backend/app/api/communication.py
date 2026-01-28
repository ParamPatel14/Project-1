from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.db.database import get_db
from app.db.models import User, Message, Meeting
from app.deps import get_current_user

router = APIRouter()

# --- Pydantic Models ---

class MessageCreate(BaseModel):
    receiver_id: int
    content: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime
    read: bool
    
    class Config:
        from_attributes = True

class MeetingCreate(BaseModel):
    attendee_id: int # Or organizer if student calls it? Let's assume user invites other.
    title: str
    start_time: datetime
    end_time: datetime
    link: Optional[str] = None

class MeetingResponse(BaseModel):
    id: int
    organizer_id: int
    attendee_id: int
    title: str
    start_time: datetime
    end_time: datetime
    status: str
    link: Optional[str] = None
    
    class Config:
        from_attributes = True

# --- Chat Endpoints ---

@router.post("/messages/", response_model=MessageResponse)
def send_message(
    msg: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify receiver exists
    receiver = db.query(User).filter(User.id == msg.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_msg = Message(
        sender_id=current_user.id,
        receiver_id=msg.receiver_id,
        content=msg.content
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return new_msg

@router.get("/messages/{other_user_id}", response_model=List[MessageResponse])
def get_chat_history(
    other_user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get messages where (sender=me AND receiver=other) OR (sender=other AND receiver=me)
    messages = db.query(Message).filter(
        or_(
            (Message.sender_id == current_user.id) & (Message.receiver_id == other_user_id),
            (Message.sender_id == other_user_id) & (Message.receiver_id == current_user.id)
        )
    ).order_by(Message.timestamp).all()
    
    return messages

@router.get("/conversations", response_model=List[dict]) # Return list of users chatted with
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # This is a bit complex in raw SQL, simplifying:
    # Find all unique user IDs in sender_id or receiver_id where other side is current_user
    sent = db.query(Message.receiver_id).filter(Message.sender_id == current_user.id).distinct()
    received = db.query(Message.sender_id).filter(Message.receiver_id == current_user.id).distinct()
    
    user_ids = set([r[0] for r in sent] + [r[0] for r in received])
    
    users = []
    for uid in user_ids:
        u = db.query(User).filter(User.id == uid).first()
        if u:
            users.append({"id": u.id, "name": u.name, "role": u.role})
            
    return users

# --- Meeting Endpoints ---

@router.post("/meetings/", response_model=MeetingResponse)
def schedule_meeting(
    meeting: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Anyone can schedule? Maybe limit to accepted mentorships later.
    new_meeting = Meeting(
        organizer_id=current_user.id,
        attendee_id=meeting.attendee_id,
        title=meeting.title,
        start_time=meeting.start_time,
        end_time=meeting.end_time,
        link=meeting.link
    )
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting

@router.get("/meetings/", response_model=List[MeetingResponse])
def get_my_meetings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Meeting).filter(
        or_(Meeting.organizer_id == current_user.id, Meeting.attendee_id == current_user.id)
    ).order_by(Meeting.start_time).all()
