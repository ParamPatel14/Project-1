from fastapi import FastAPI
from app.database import engine
from app.models import Base
from app.routes import users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow React to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router)

@app.get("/")
def root():
    return {"message": "Backend working 🚀"}
