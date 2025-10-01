from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="GLI Webapp API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')

class UserRole(str, Enum):
    INWONER = "inwoner"
    DEELNEMER = "deelnemer"
    VERWIJZER = "verwijzer"
    PROFESSIONAL = "professional"
    ADMIN = "admin"

# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    role: UserRole
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: UserRole

class UserLogin(BaseModel):
    email: str
    password: str

class Program(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    duration: str
    focus_areas: List[str]
    target_group: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Coach(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    specialization: str
    phone: str
    email: str
    location: str
    programs: List[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Resource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str  # exercise, recipe, document, link
    content: str  # URL or content
    target_role: List[UserRole]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Event(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: datetime
    location: str
    target_audience: List[UserRole]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FAQ(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    category: str
    target_role: List[UserRole]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    request_type: str  # info, referral, support
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_data: dict) -> str:
    return jwt.encode(user_data, JWT_SECRET, algorithm='HS256')

def verify_jwt_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = verify_jwt_token(token)
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        user_doc = await db.users.find_one({"email": user_email})
        if not user_doc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        return User(**user_doc)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

# Authentication routes
@api_router.post("/auth/register")
async def register_user(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    user_dict = user_data.dict()
    del user_dict['password']
    user_obj = User(**user_dict)
    
    # Store user with hashed password
    user_doc = user_obj.dict()
    user_doc['password'] = hashed_password
    await db.users.insert_one(user_doc)
    
    # Create token
    token_data = {"email": user_obj.email, "role": user_obj.role}
    token = create_jwt_token(token_data)
    
    return {"user": user_obj, "token": token}

@api_router.post("/auth/login")
async def login_user(login_data: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": login_data.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(login_data.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(**user_doc)
    
    # Create token
    token_data = {"email": user.email, "role": user.role}
    token = create_jwt_token(token_data)
    
    return {"user": user, "token": token}

@api_router.get("/auth/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Public routes
@api_router.get("/")
async def root():
    return {"message": "GLI Webapp API", "version": "1.0.0"}

@api_router.get("/programs", response_model=List[Program])
async def get_programs():
    programs = await db.programs.find().to_list(1000)
    return [Program(**program) for program in programs]

@api_router.get("/coaches", response_model=List[Coach])
async def get_coaches():
    coaches = await db.coaches.find().to_list(1000)
    return [Coach(**coach) for coach in coaches]

@api_router.get("/faqs", response_model=List[FAQ])
async def get_faqs(role: Optional[str] = None):
    query = {}
    if role:
        query["target_role"] = {"$in": [role]}
    
    faqs = await db.faqs.find(query).to_list(1000)
    return [FAQ(**faq) for faq in faqs]

@api_router.post("/contact")
async def create_contact_request(contact: ContactRequest):
    contact_dict = contact.dict()
    await db.contact_requests.insert_one(contact_dict)
    return {"message": "Contact request submitted successfully"}

# Protected routes
@api_router.get("/resources", response_model=List[Resource])
async def get_resources(current_user: User = Depends(get_current_user)):
    resources = await db.resources.find({"target_role": {"$in": [current_user.role]}}).to_list(1000)
    return [Resource(**resource) for resource in resources]

@api_router.get("/events", response_model=List[Event])
async def get_events(current_user: User = Depends(get_current_user)):
    events = await db.events.find({"target_audience": {"$in": [current_user.role]}}).to_list(1000)
    return [Event(**event) for event in events]

# Admin routes (for seeding data)
@api_router.post("/admin/seed")
async def seed_data():
    # Seed programs
    programs_data = [
        {
            "name": "BeweegKuur",
            "description": "Intensief medisch begeleide leefstijlinterventie voor mensen met diabetes type 2, hart- en vaatziekten of overgewicht.",
            "duration": "12 maanden",
            "focus_areas": ["Voeding", "Beweging", "Gedrag", "Medische begeleiding"],
            "target_group": "Mensen met diabetes type 2, hart- en vaatziekten, overgewicht"
        },
        {
            "name": "COOL",
            "description": "Leefstijlprogramma gericht op mindset, motivatie en duurzame gedragsverandering.",
            "duration": "6 maanden",
            "focus_areas": ["Mindset", "Motivatie", "Gedragsverandering", "Beweging"],
            "target_group": "Volwassenen die hun leefstijl duurzaam willen veranderen"
        },
        {
            "name": "SLIMMER",
            "description": "Diabetespreventie programma voor mensen met verhoogd risico op diabetes type 2.",
            "duration": "12 maanden",
            "focus_areas": ["Diabetespreventie", "Voeding", "Beweging", "Gewichtsmanagement"],
            "target_group": "Mensen met verhoogd risico op diabetes type 2"
        }
    ]
    
    for program_data in programs_data:
        program = Program(**program_data)
        await db.programs.insert_one(program.dict())
    
    # Seed coaches
    coaches_data = [
        {
            "name": "Dr. Sarah van der Berg",
            "specialization": "Leefstijlgeneeskunde",
            "phone": "+31 30 123 4567",
            "email": "s.vandenberg@zorg4zeist.nl",
            "location": "Zeist Centrum",
            "programs": ["BeweegKuur", "SLIMMER"]
        },
        {
            "name": "Mark Jansen",
            "specialization": "Gedragspsychologie",
            "phone": "+31 30 234 5678",
            "email": "m.jansen@zorg4zeist.nl",
            "location": "Zeist West",
            "programs": ["COOL", "BeweegKuur"]
        },
        {
            "name": "Lisa de Wit",
            "specialization": "Voeding & Beweging",
            "phone": "+31 30 345 6789",
            "email": "l.dewit@zorg4zeist.nl",
            "location": "Vollenhove",
            "programs": ["BeweegKuur", "COOL", "SLIMMER"]
        }
    ]
    
    for coach_data in coaches_data:
        coach = Coach(**coach_data)
        await db.coaches.insert_one(coach.dict())
    
    # Seed FAQs
    faqs_data = [
        {
            "question": "Wat is de GLI?",
            "answer": "De Gecombineerde Leefstijlinterventie (GLI) is een wetenschappelijk onderbouwd programma dat zich richt op vier pijlers: voeding, beweging, gedrag en slaap/stress. Het helpt mensen bij het aanleren van een gezonde leefstijl.",
            "category": "algemeen",
            "target_role": ["inwoner", "deelnemer"]
        },
        {
            "question": "Hoe verwijs ik een patiënt naar de GLI?",
            "answer": "Verwijzingen gaan uitsluitend via VIP Live. Selecteer 'GLI-verwijzing', kies het juiste programma en vermeld BMI, co-morbiditeiten en motivatie van de patiënt.",
            "category": "verwijzing",
            "target_role": ["verwijzer"]
        },
        {
            "question": "Wat kan ik verwachten van het traject?",
            "answer": "Je wordt persoonlijk begeleid door een leefstijlcoach en krijgt stap voor stap hulp bij het ontwikkelen van gezonde gewoontes. Het traject bestaat uit groepsbijeenkomsten en individuele coaching.",
            "category": "traject",
            "target_role": ["deelnemer"]
        }
    ]
    
    for faq_data in faqs_data:
        faq = FAQ(**faq_data)
        await db.faqs.insert_one(faq.dict())
    
    return {"message": "Data seeded successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()