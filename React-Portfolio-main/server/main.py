from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
import json
import os
import datetime
from database import init_db, get_db_connection
from dotenv import load_dotenv

load_dotenv()

security = HTTPBearer()
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "supersecrettoken")

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authentication token"
        )
    return credentials.credentials

app = FastAPI(
    title="Aayush Portfolio API",
    description="FastAPI Backend service for contact requests and project listings",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Load projects from JSON
PROJECTS_JSON_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../client/src/lib/projectsData.json"
    )
)

def load_projects():
    try:
        with open(PROJECTS_JSON_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading projects: {e}")
        return []

# Models
class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    message: str = Field(..., min_length=10)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.datetime.utcnow().isoformat()}

@app.get("/api/projects")
def get_projects():
    return load_projects()

@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
def save_contact(request: ContactRequest):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
            (request.name.strip(), request.email.strip(), request.message.strip())
        )
        conn.commit()
        last_id = cursor.lastrowid
        conn.close()
        return {
            "success": True,
            "message": "Message saved successfully",
            "id": last_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@app.get("/api/messages")
def get_messages(token: str = Depends(verify_token)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM messages ORDER BY created_at DESC")
        messages = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return messages
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)
