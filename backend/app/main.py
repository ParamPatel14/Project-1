from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.api.auth import router as auth_router
from app.routes.users import router as users_router
from app.api.profiles import router as profiles_router
from app.api.admin import router as admin_router
from app.api.opportunities import router as opportunities_router
from app.api.applications import router as applications_router
from app.api.skills import router as skills_router
from app.api.improvement import router as improvement_router
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Academic Research Matching Platform")



# Add SessionMiddleware with explicit configuration for localhost
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    max_age=3600,
    https_only=False,  # Essential for localhost (http)
    same_site="lax"    # Allows cookies to be sent in redirects
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(profiles_router, prefix="/profiles", tags=["Profiles"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(opportunities_router, prefix="/opportunities", tags=["Opportunities"])
app.include_router(applications_router, prefix="/applications", tags=["Applications"])
app.include_router(skills_router, prefix="/skills", tags=["Skills"])
app.include_router(improvement_router, prefix="/improvement", tags=["Improvement Plans"])

@app.get("/")
def root():
    return {"message": "Backend running"}
