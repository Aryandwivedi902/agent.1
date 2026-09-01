# HRFlow AI — Core FastAPI Application entrypoint
import uuid
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from db import get_db, Organization, User, Employee, EmployeeRequest, Policy, Approval, Candidate, AuditLog, TenantFilteredQuery
from auth import get_current_user, UserSession, require_hr_admin, require_hr_manager, require_auditor, verify_password, get_password_hash, create_access_token
from agents import backend_orchestrator, OrchestrationResponse

app = FastAPI(title="HRFlow AI API Console", version="1.0.0")

# Enforce security parameters via CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production specify NextJS origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST SCHEMAS ---

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    conversationId: str
    message: str

class ApprovalActionRequest(BaseModel):
    action: str # approve, reject
    comment: Optional[str] = None

class ApiKeyConfigRequest(BaseModel):
    provider: str
    apiKey: str

class OnboardingRegisterRequest(BaseModel):
    companyName: str
    domain: str
    country: str
    timezone: str
    adminEmail: str
    adminPassword: str
    adminFirstName: str
    adminLastName: str

# --- HEALTH CHECK ---

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "hrflow-ai-api"}

# --- AUTH & REGISTER ENDPOINTS ---

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password credentials")
    
    token = create_access_token({
        "sub": str(user.id),
        "org": str(user.organization_id),
        "email": user.email,
        "role": user.role
    })
    
    return {
        "token": token,
        "user": {
            "id": str(user.id),
            "firstName": user.first_name,
            "lastName": user.last_name,
            "role": user.role,
            "organizationId": str(user.organization_id)
        }
    }

@app.post("/api/onboarding/register", status_code=201)
def register_organization(req: OnboardingRegisterRequest, db: Session = Depends(get_db)):
    # Check domain
    existing = db.query(Organization).filter(Organization.domain == req.domain).first()
    if existing:
        raise HTTPException(status_code=400, detail="Domain domain registration conflict")

    # Create Organization
    org = Organization(name=req.companyName, domain=req.domain)
    db.add(org)
    db.flush()

    # Create Admin user
    pwd_hash = get_password_hash(req.adminPassword)
    admin_user = User(
        organization_id=org.id,
        email=req.adminEmail,
        password_hash=pwd_hash,
        first_name=req.adminFirstName,
        last_name=req.adminLastName,
        role="HR_ADMIN"
    )
    db.add(admin_user)
    db.flush()

    # Create Employee profile for Admin
    emp = Employee(
        organization_id=org.id,
        user_id=admin_user.id,
        employee_id_number="EMP-001",
        first_name=req.adminFirstName,
        last_name=req.adminLastName,
        work_email=req.adminEmail,
        job_title="HR Director",
        department="Human Resources"
    )
    db.add(emp)

    # Add default Leave Policy
    pol = Policy(
        organization_id=org.id,
        title="Acme Paid Time Off (PTO) Policy",
        summary="Standard leave guidelines.",
        category="Time Off",
        chunks=["Full time employees accrue PTO hours at a rate of 1.25 days per month (15 days annually). Unused carryover limit is 5 days."]
    )
    db.add(pol)

    # Write initial Audit Log
    log = AuditLog(
        organization_id=org.id,
        actor=req.adminEmail,
        actor_type="user",
        action="ONBOARD_REGISTER",
        resource="organizations",
        result="success",
        details=f"Successfully onboarded organization: {req.companyName} and created admin account."
    )
    db.add(log)
    
    db.commit()
    return {"status": "success", "organizationId": str(org.id)}

# --- AGENT CONVERSATION ENDPOINT ---

@app.post("/api/ai-manager/chat", response_model=OrchestrationResponse)
def ai_manager_chat(
    req: ChatRequest, 
    current_user: UserSession = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    org_id = uuid.UUID(current_user.organization_id)
    
    # Process user query using core multi-agent orchestrator
    result = backend_orchestrator.process_request(
        db=db,
        org_id=org_id,
        user_email=current_user.email,
        user_role=current_user.role,
        message=req.message
    )
    
    # Write chat audit
    log = AuditLog(
        organization_id=org_id,
        actor=current_user.email,
        actor_type="user",
        action="AGENT_QUERY",
        resource="conversations",
        result="success",
        details=f"User prompted HR AI Manager: '{req.message[:50]}...'. Result: {result.status}"
    )
    db.add(log)
    db.commit()
    
    return result

# --- APPROVALS QUEUE ENDPOINTS ---

@app.get("/api/approvals/pending")
def list_pending_approvals(
    current_user: UserSession = Depends(require_hr_manager), 
    db: Session = Depends(get_db)
):
    org_id = uuid.UUID(current_user.organization_id)
    t_query = TenantFilteredQuery(db, org_id)
    pending = [a for a in t_query.get_approvals() if a.status == "pending"]
    return pending

@app.post("/api/approvals/{approval_id}/action")
def execute_approval(
    approval_id: str,
    req: ApprovalActionRequest,
    current_user: UserSession = Depends(require_hr_admin),
    db: Session = Depends(get_db)
):
    org_id = uuid.UUID(current_user.organization_id)
    app_uuid = uuid.UUID(approval_id)
    
    app = db.query(Approval).filter(Approval.id == app_uuid, Approval.organization_id == org_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Pending transaction approval request not found")

    if req.action == "approve":
        app.status = "approved"
        # Simulate background task executing the action
        app.status = "executed"
        
        # Log successful action
        log = AuditLog(
            organization_id=org_id,
            actor=current_user.email,
            actor_type="user",
            action="EXECUTE_APPROVAL",
            resource="approvals",
            result="success",
            details=f"Approved & executed transactional action: {app.action_type}"
        )
        db.add(log)
    elif req.action == "reject":
        app.status = "rejected"
        log = AuditLog(
            organization_id=org_id,
            actor=current_user.email,
            actor_type="user",
            action="REJECT_APPROVAL",
            resource="approvals",
            result="success",
            details=f"Rejected transactional action: {app.action_type}"
        )
        db.add(log)
    else:
        raise HTTPException(status_code=400, detail="Invalid action value")

    db.commit()
    return {"status": "success", "approvalStatus": app.status}

@app.post("/api/settings/api-keys")
def update_api_key(
    req: ApiKeyConfigRequest,
    current_user: UserSession = Depends(require_hr_admin),
    db: Session = Depends(get_db)
):
    backend_orchestrator.set_api_key(req.apiKey)
    log = AuditLog(
        organization_id=uuid.UUID(current_user.organization_id),
        actor=current_user.email,
        actor_type="user",
        action="UPDATE_API_KEY",
        resource="settings",
        result="success",
        details=f"Configured API Key for provider: {req.provider}"
    )
    db.add(log)
    db.commit()
    return {"status": "success", "provider": req.provider, "message": "API key successfully saved & connected to LLM engine"}

# --- AUDIT LOGS ENDPOINT ---

@app.get("/api/audit-logs")
def list_audit_logs(
    current_user: UserSession = Depends(require_auditor), 
    db: Session = Depends(get_db)
):
    org_id = uuid.UUID(current_user.organization_id)
    t_query = TenantFilteredQuery(db, org_id)
    return t_query.get_audit_logs()
