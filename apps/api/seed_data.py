# HRFlow AI — Database Seeder Script
import uuid
from datetime import datetime
from db import Base, engine, SessionLocal, Organization, User, Employee, EmployeeRequest, Policy, Approval, Candidate, AuditLog
from auth import get_password_hash

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if seed org already exists
    org = db.query(Organization).filter(Organization.domain == "northstar.tech").first()
    if not org:
        print("[SEED] Creating Northstar Technologies Demo Organization...")
        org = Organization(
            id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
            name="Northstar Technologies",
            domain="northstar.tech",
            status="active"
        )
        db.add(org)
        db.flush()

        # Admin user
        admin_pass = get_password_hash("AdminPass123!")
        admin_user = User(
            id=uuid.UUID("22222222-2222-2222-2222-222222222222"),
            organization_id=org.id,
            email="aryan.dwivedi@northstar.tech",
            password_hash=admin_pass,
            first_name="Aryan",
            last_name="Dwivedi",
            role="HR_ADMIN"
        )
        db.add(admin_user)
        db.flush()

        # Employees
        emp1 = Employee(
            id=uuid.UUID("33333333-3333-3333-3333-333333333333"),
            organization_id=org.id,
            user_id=admin_user.id,
            employee_id_number="EMP-001",
            first_name="Aryan",
            last_name="Dwivedi",
            work_email="aryan.dwivedi@northstar.tech",
            job_title="HR Director",
            department="Human Resources"
        )
        emp2 = Employee(
            id=uuid.UUID("33333333-3333-3333-3333-333333333334"),
            organization_id=org.id,
            employee_id_number="EMP-002",
            first_name="Sarah",
            last_name="Connor",
            work_email="sarah.connor@northstar.tech",
            job_title="Senior Software Engineer",
            department="Engineering"
        )
        db.add_all([emp1, emp2])

        # Policy
        pol1 = Policy(
            organization_id=org.id,
            title="2026 Health & PTO Policy Handbook",
            summary="Official leave and rollover guidelines.",
            category="Policy",
            chunks=[
                "Full-time employees accrue PTO at a rate of 1.25 days per month (15 days annually). A maximum of 5 unused days may roll over into the subsequent fiscal year.",
                "Maternity leave covers 16 weeks of fully paid leave. Paternity leave covers 8 weeks of fully paid leave."
            ]
        )
        db.add(pol1)

        # Candidates
        cand1 = Candidate(
            organization_id=org.id,
            first_name="Sarah",
            last_name="Connor",
            email="sarah.connor@gmail.com",
            status="applied",
            match_score=94,
            matched_criteria=["Node.js", "React", "Python", "System Architecture"],
            missing_criteria=["GraphQL"]
        )
        db.add(cand1)

        # Approvals
        app1 = Approval(
            organization_id=org.id,
            requested_by="Email Agent",
            action_type="send_email_batch",
            risk_level="medium",
            status="pending",
            payload={"recipientCount": 12, "subject": "Interview Proposal"},
            evidence="Shortlisted candidates match score >= 88%"
        )
        db.add(app1)

        # Audit Log
        log1 = AuditLog(
            organization_id=org.id,
            actor="system",
            actor_type="system",
            action="SYSTEM_INIT",
            resource="organizations",
            result="success",
            details="Demo database seeded for Northstar Technologies."
        )
        db.add(log1)

        db.commit()
        print("[SEED] Successfully seeded database!")
    else:
        print("[SEED] Organization already exists. Database ready.")

    db.close()

if __name__ == "__main__":
    seed()
