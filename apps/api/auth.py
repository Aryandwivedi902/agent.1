# HRFlow AI — Authentication & RBAC Layer (Python/FastAPI)
import os
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr

SECRET_KEY = os.getenv("AUTH_SECRET", "generate_a_secure_long_secret_here_for_nextauth")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security_bearer = HTTPBearer()

# --- Pydantic Schemas for Auth Context ---

class TokenData(BaseModel):
    user_id: str
    organization_id: str
    email: str
    role: str

class UserSession(BaseModel):
    id: str
    organization_id: str
    email: str
    role: str

# --- Cryptography Helpers ---

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- Dependency Injectors (RBAC Checks) ---

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)) -> UserSession:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        org_id: str = payload.get("org")
        email: str = payload.get("email")
        role: str = payload.get("role")
        
        if not user_id or not org_id or not role:
            raise credentials_exception
            
        return UserSession(id=user_id, organization_id=org_id, email=email, role=role)
    except JWTError:
        raise credentials_exception

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: UserSession = Depends(get_current_user)) -> UserSession:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission Denied: User role '{current_user.role}' lacks clearance for this scope."
            )
        return current_user

# Usage variables
require_hr_admin = RoleChecker(["HR_ADMIN", "ORGANIZATION_ADMIN"])
require_hr_manager = RoleChecker(["HR_ADMIN", "ORGANIZATION_ADMIN", "HR_MANAGER"])
require_auditor = RoleChecker(["HR_ADMIN", "ORGANIZATION_ADMIN", "AUDITOR"])
