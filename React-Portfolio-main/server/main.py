from fastapi import FastAPI, HTTPException, status, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
import json
import os
import datetime
import jwt
import hashlib
import urllib.request
import urllib.error
from jwt import ExpiredSignatureError, InvalidTokenError
from database import init_db, get_db_connection
from dotenv import load_dotenv


load_dotenv()

security = HTTPBearer()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_super_secret_key_12345")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Admin Configuration
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    return salt.hex() + ":" + pwdhash.hex()

def verify_password(stored_password_hash: str, provided_password: str) -> bool:
    try:
        salt_hex, hash_hex = stored_password_hash.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)
        pwdhash = hashlib.pbkdf2_hmac('sha256', provided_password.encode('utf-8'), salt, 100000)
        return pwdhash == expected_hash
    except Exception:
        return False

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Verify user exists in the database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return username
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authentication token"
        )

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

def seed_admin_user():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = ?", (ADMIN_USERNAME,))
        user = cursor.fetchone()
        if not user:
            admin_pwd_hash = hash_password(ADMIN_PASSWORD)
            cursor.execute(
                "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
                (ADMIN_USERNAME, "admin@example.com", admin_pwd_hash)
            )
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error seeding admin user: {e}")

seed_admin_user()


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
class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    message: str = Field(..., min_length=10)

@app.post("/api/signup", status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest):
    username = request.username.strip()
    email = request.email.strip().lower()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
    existing_user = cursor.fetchone()
    
    if existing_user:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
        
    password_hash = hash_password(request.password)
    
    try:
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, password_hash)
        )
        conn.commit()
        last_id = cursor.lastrowid
        conn.close()
        return {
            "success": True,
            "message": "User registered successfully",
            "id": last_id
        }
    except Exception as e:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@app.post("/api/login")
def login(request: LoginRequest):
    username = request.username.strip()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT username, password_hash FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(user["password_hash"], request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": username,
        "exp": expire,
        "iat": datetime.datetime.now(datetime.timezone.utc)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()}

@app.get("/api/projects")
def get_projects():
    return load_projects()

def send_confirmation_email(recipient_email: str, recipient_name: str, message_content: str):
    api_key = os.getenv("Mailer_Send_API")
    sender_email = os.getenv("Mailer_Sender_Email", "portfolio@test-eqvygm0dn98l0p7w.mlsender.net")
    if not api_key:
        print("Mailer_Send_API not configured in environment.")
        return

    # Truncate message content for preview if it's too long
    preview_message = message_content[:200] + "..." if len(message_content) > 200 else message_content

    payload = {
        "from": {
            "email": sender_email,
            "name": "Aayush Sinha"
        },
        "to": [
            {
                "email": recipient_email,
                "name": recipient_name
            }
        ],
        "subject": "Collaboration Request Received",
        "text": (
            f"Hi {recipient_name},\n\n"
            "Thank you for reaching out! This is a confirmation email that I have received your message regarding collaboration. "
            "I will review your request and get back to you within 24 hours.\n\n"
            "Here is a copy of your message:\n"
            f"\"{preview_message}\"\n\n"
            "Best regards,\n"
            "Aayush Sinha"
        ),
        "html": (
            f"<div style='font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;'>"
            f"<h2 style='color: #6d28d9;'>Collaboration Request Received</h2>"
            f"<p>Hi <strong>{recipient_name}</strong>,</p>"
            f"<p>Thank you for reaching out! This is a confirmation email that I have received your message regarding collaboration. "
            f"I will review your request and get back to you within 24 hours.</p>"
            f"<div style='background-color: #f3f4f6; border-left: 4px solid #6d28d9; padding: 15px; margin: 20px 0; font-style: italic;'>"
            f"\"{preview_message}\""
            f"</div>"
            f"<p>Best regards,<br/><strong>Aayush Sinha</strong></p>"
            f"</div>"
        )
    }

    req = urllib.request.Request(
        "https://api.mailersend.com/v1/email",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Confirmation email sent to {recipient_email}. Status code: {response.status}")
    except urllib.error.HTTPError as e:
        print(f"Failed to send confirmation email. HTTP Error: {e.code} - {e.reason}")
        try:
            print(e.read().decode())
        except Exception:
            pass
    except Exception as e:
        print(f"Error sending confirmation email: {e}")

@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
def save_contact(request: ContactRequest, background_tasks: BackgroundTasks):
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
        
        # Send confirmation email in background
        background_tasks.add_task(
            send_confirmation_email,
            recipient_email=request.email.strip(),
            recipient_name=request.name.strip(),
            message_content=request.message.strip()
        )
        
        return {
            "success": True,
            "message": "Message saved and confirmation email sent successfully",
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
