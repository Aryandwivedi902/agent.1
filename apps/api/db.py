# HRFlow AI — Database Layer (Python/SQLAlchemy)
import os
import uuid
from datetime import datetime
from typing import Generator
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, ForeignKey, Integer, Numeric, Text, JSON
from sqlalchemy.types import TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID as pgUUID
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/hrflow_db")

# Platform-independent GUID type (converts to pgUUID on Postgres, CHAR(36) on SQLite)
class GUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(pgUUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return uuid.UUID(value) if not isinstance(value, uuid.UUID) else value

# Dynamic engine selection (try Postgres, fallback to SQLite)
try:
    # Set a short timeout (2s) to check Postgres availability
    if "postgresql" in DATABASE_URL:
        engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 2})
        with engine.connect() as conn:
            pass
        print("[DATABASE] Connected to PostgreSQL successfully.")
    else:
        raise ValueError("SQLite configuration requested.")
except Exception:
    DATABASE_URL = "sqlite:///hrflow_db.sqlite"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    print("[DATABASE] PostgreSQL is not reachable. Falling back to self-contained SQLite.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- DATABASE MODELS ---

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    role = Column(String(50), default="EMPLOYEE")
    status = Column(String(50), default="active")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(GUID(), ForeignKey("users.id", ondelete="SET NULL"))
    employee_id_number = Column(String(100))
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    work_email = Column(String(255), nullable=False)
    job_title = Column(String(255))
    department = Column(String(255))
    salary_encrypted = Column(Text)
    bank_account_encrypted = Column(Text)
    status = Column(String(50), default="active")
    start_date = Column(DateTime)

class EmployeeRequest(Base):
    __tablename__ = "employee_requests"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    employee_id = Column(GUID(), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    request_type = Column(String(100), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), default="medium")
    status = Column(String(50), default="open")
    created_at = Column(DateTime, default=datetime.utcnow)

class Policy(Base):
    __tablename__ = "policies"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    summary = Column(Text)
    category = Column(String(100), nullable=False)
    status = Column(String(50), default="published")
    version = Column(Integer, default=1)
    file_path = Column(String(512))
    chunks = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)

class Approval(Base):
    __tablename__ = "approvals"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    requested_by = Column(String(100), nullable=False)
    action_type = Column(String(100), nullable=False)
    risk_level = Column(String(20), default="medium")
    status = Column(String(50), default="pending")
    payload = Column(JSON, nullable=False)
    evidence = Column(Text)
    warnings = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    status = Column(String(50), default="applied")
    match_score = Column(Integer, default=0)
    matched_criteria = Column(JSON, default=[])
    missing_criteria = Column(JSON, default=[])
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    organization_id = Column(GUID(), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    actor = Column(String(255), nullable=False)
    actor_type = Column(String(50), default="user")
    action = Column(String(255), nullable=False)
    resource = Column(String(100), nullable=False)
    result = Column(String(50), nullable=False)
    details = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Ensure all tables are created on startup (automatic schema initialization)
Base.metadata.create_all(bind=engine)

# --- SESSION CONTEXT MANAGERS ---

def get_db() -> Generator:
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        db_session.close()

class TenantFilteredQuery:
    def __init__(self, db_session, org_id: uuid.UUID):
        self.db = db_session
        self.org_id = org_id

    def get_employees(self):
        return self.db.query(Employee).filter(Employee.organization_id == self.org_id).all()

    def get_requests(self):
        return self.db.query(EmployeeRequest).filter(EmployeeRequest.organization_id == self.org_id).all()

    def get_policies(self):
        return self.db.query(Policy).filter(Policy.organization_id == self.org_id).all()

    def get_approvals(self):
        return self.db.query(Approval).filter(Approval.organization_id == self.org_id).all()

    def get_candidates(self):
        return self.db.query(Candidate).filter(Candidate.organization_id == self.org_id).all()

    def get_audit_logs(self):
        return self.db.query(AuditLog).filter(AuditLog.organization_id == self.org_id).order_by(AuditLog.timestamp.desc()).all()
