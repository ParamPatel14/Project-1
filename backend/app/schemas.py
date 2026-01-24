from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    name: str

class UserResponse(UserCreate):
    id: int
