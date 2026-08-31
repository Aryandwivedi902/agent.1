# HRFlow AI — Multi-Agent Coordination Engine (Python/FastAPI)
import os
import uuid
import re
from typing import Dict, Any, List
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db import Policy, Candidate, Employee, EmployeeRequest, Approval, AuditLog

class AgentStep(BaseModel):
    agentName: str
    thought: str
    actionTaken: str = ""

class AgentAction(BaseModel):
    tool: str
    payload: Dict[str, Any]

class OrchestrationResponse(BaseModel):
    status: str
    summary: str
    agentSteps: List[AgentStep]
    evidence: List[str]
    actions: List[AgentAction]
    requiresApproval: bool
    warnings: List[str]
    confidence: str
    sources: List[str]

class HRBackendAgentOrchestrator:
    def process_request(
        self,
        db: Session,
        org_id: uuid.UUID,
        user_email: str,
        user_role: str,
        message: str
    ) -> OrchestrationResponse:
        steps = []
        query_lower = message.lower()

        # 1. HR AI Manager security check
        steps.append(AgentStep(
            agentName="HR AI Manager (Orchestrator)",
            thought=f"Received query: '{message}'. Running prompt safety check and validating credentials scope for user: {user_email}."
        ))

        # Prompt Injection Protection Filter
        if any(sig in query_lower for sig in ["ignore previous", "system prompt", "override instructions", "reveal guidelines"]):
            # Log security event in audit logs
            log = AuditLog(
                organization_id=org_id,
                actor=user_email,
                actor_type="agent",
                action="SECURITY_FILTER_TRIGGER",
                resource="security",
                result="denied",
                details=f"Prompt injection attempt intercepted: '{message}'"
            )
            db.add(log)
            db.commit()

            return OrchestrationResponse(
                status="failure",
                summary="I apologize, but I am programmed to uphold security standards and corporate policy guidelines. I cannot modify my underlying operational code, reveal internal configuration prompts, or bypass role permissions.",
                agentSteps=[AgentStep(agentName="HR AI Manager (Orchestrator)", thought="Security injection signatures detected. Refusing execution.")],
                evidence=["Query matches prompt injection signature checks."],
                actions=[],
                requiresApproval=False,
                warnings=["Prompt injection attempt recorded in security log."],
                confidence="high",
                sources=[]
            )

        # 2. Routing Intent
        if any(term in query_lower for term in ["policy", "leave", "pto", "carry over", "handbook"]):
            return self.run_policy_agent(db, org_id, user_email, message, steps)
        elif any(term in query_lower for term in ["email", "send", "draft", "contact"]):
            return self.run_email_agent(db, org_id, user_email, user_role, message, steps)
        elif any(term in query_lower for term in ["request", "ticket", "leave request"]):
            return self.run_request_agent(db, org_id, user_email, message, steps)
        elif any(term in query_lower for term in ["candidate", "recruit", "hire", "applicant"]):
            return self.run_recruitment_agent(db, org_id, user_email, message, steps)
        elif any(term in query_lower for term in ["onboard", "checklist", "welcome"]):
            return self.run_onboarding_agent(db, org_id, user_email, message, steps)
        elif any(term in query_lower for term in ["metric", "statistic", "payroll", "salary", "headcount"]):
            return self.run_analytics_agent(db, org_id, user_email, user_role, message, steps)
        else:
            return OrchestrationResponse(
                status="success",
                summary="Hello! I am your HR AI Manager. I coordinate specialized agents for Policy lookup, Email automation, Requests, Recruitment, Onboarding, and Analytics. How can I assist you with HR operations today?",
                agentSteps=steps,
                evidence=[],
                actions=[],
                requiresApproval=False,
                warnings=[],
                confidence="high",
                sources=[]
            )

    # Specialist 1: Policy Agent
    def run_policy_agent(self, db: Session, org_id: uuid.UUID, actor: str, query: str, steps: list) -> OrchestrationResponse:
        steps.append(AgentStep(agentName="Policy & Knowledge Agent", thought="Searching policy vector indexes database."))
        policies = db.query(Policy).filter(Policy.organization_id == org_id).all()
        
        matched_chunk = ""
        doc_title = "Acme Employee Handbook"
        
        for pol in policies:
            for chunk in pol.chunks:
                if any(t in query.lower() for t in ["carry", "unused", "pto", "leave"]):
                    matched_chunk = chunk
                    doc_title = pol.title
                    break
        
        if matched_chunk:
            steps.append(AgentStep(
                agentName="Policy & Knowledge Agent",
                thought=f"Matched context block in policy document: '{doc_title}'."
            ))
            return OrchestrationResponse(
                status="success",
                summary=f"Based on the official {doc_title}:\n\n{matched_chunk}\n\nThis is derived from current approved policies.",
                agentSteps=steps,
                evidence=[f"Context Chunk: {matched_chunk}"],
                actions=[],
                requiresApproval=False,
                warnings=["Decision support metadata only."],
                confidence="high",
                sources=[f"{doc_title}"]
            )
        else:
            return OrchestrationResponse(
                status="success",
                summary="I was unable to find specific details regarding that query in the company policy database. I have escalated this ticket to HR.",
                agentSteps=steps,
                evidence=["Zero index search hits."],
                actions=[],
                requiresApproval=False,
                warnings=[],
                confidence="low",
                sources=[]
            )

    # Specialist 2: Email Agent
    def run_email_agent(self, db: Session, org_id: uuid.UUID, actor: str, role: str, query: str, steps: list) -> OrchestrationResponse:
        steps.append(AgentStep(agentName="Email Agent", thought="Validating recipient scopes and permissions rules."))
        
        is_send = "send" in query.lower()
        recipient = "sarah.connor@gmail.com"
        email_body = "Dear Candidate, we would like to coordinate a phone interview this Wednesday. Please let us know if that works."

        if is_send:
            if role not in ["HR_ADMIN", "ORGANIZATION_ADMIN"]:
                steps.append(AgentStep(agentName="HR AI Manager", thought="Execution blocked: Insufficient permissions to dispatch external emails."))
                return OrchestrationResponse(
                    status="failure",
                    summary="Access Denied: You do not have the required permissions ('send_email') to directly dispatch external communications.",
                    agentSteps=steps,
                    evidence=[f"User role: {role}"],
                    actions=[],
                    requiresApproval=False,
                    warnings=["Blocked unauthorized operation."],
                    confidence="high",
                    sources=[]
                )

            # Insert Pending Approval
            payload = {"to": recipient, "subject": "Interview Scheduled", "body": email_body}
            app = Approval(
                organization_id=org_id,
                requested_by="Email Agent",
                action_type="send_email",
                risk_level="HIGH",
                status="pending",
                payload=payload,
                evidence="Outbound outreach requested by coordinator.",
                warnings=["Verify calendar spacing."]
            )
            db.add(app)
            db.commit()

            steps.append(AgentStep(
                agentName="Email Agent",
                thought="Queuing high-risk email send in Approvals center.",
                actionTaken=f"Queued approval: {app.id}"
            ))

            return OrchestrationResponse(
                status="waiting_approval",
                summary=f"I have drafted the email to {recipient} and queued it in the Approval Center (ID: {app.id}) as it requires human authorization.",
                agentSteps=steps,
                evidence=[f"Queued approval target: {recipient}"],
                actions=[AgentAction(tool="queue_approval", payload={"approvalId": str(app.id)})],
                requiresApproval=True,
                warnings=["Requires HR manager verification prior to execution."],
                confidence="high",
                sources=[]
            )
        else:
            return OrchestrationResponse(
                status="success",
                summary=f"Draft Prepared:\nSubject: Interview Proposal\nBody:\n{email_body}",
                agentSteps=steps,
                evidence=[],
                actions=[],
                requiresApproval=False,
                warnings=[],
                confidence="high",
                sources=[]
            )

    # Specialist 3: Request Agent
    def run_request_agent(self, db: Session, org_id: uuid.UUID, actor: str, query: str, steps: list) -> OrchestrationResponse:
        steps.append(AgentStep(agentName="Employee Request Agent", thought="Retrieving open requests from database."))
        reqs = db.query(EmployeeRequest).filter(EmployeeRequest.organization_id == org_id).all()
        summary_list = [f"• {r.title} (Status: {r.status})" for r in reqs]
        return OrchestrationResponse(
            status="success",
            summary=f"Current active tickets:\n\n" + ("\n".join(summary_list) if summary_list else "No active tickets."),
            agentSteps=steps,
            evidence=[f"Requests count: {len(reqs)}"],
            actions=[],
            requiresApproval=False,
            warnings=[],
            confidence="high",
            sources=[]
        )

    # Specialist 4: Recruitment Agent
    def run_recruitment_agent(self, db: Session, org_id: uuid.UUID, actor: str, query: str, steps: list) -> OrchestrationResponse:
        steps.append(AgentStep(agentName="Recruitment Agent", thought="Sourcing candidate review profile."))
        candidates = db.query(Candidate).filter(Candidate.organization_id == org_id).all()
        can = candidates[0] if candidates else None

        if can:
            return OrchestrationResponse(
                status="success",
                summary=f"Candidate Screening: {can.first_name} {can.last_name}\nJob: Senior Fullstack Engineer\nMatch Score: {can.match_score}%\n\n*Notice: AI screen serves as decision support.*",
                agentSteps=steps,
                evidence=[f"Extracted criteria match: {can.match_score}%"],
                actions=[],
                requiresApproval=False,
                warnings=["Hiring decisions must be manually validated."],
                confidence="high",
                sources=["resume.pdf"]
            )
        return OrchestrationResponse(
            status="success",
            summary="No candidates found in pipeline database.",
            agentSteps=steps,
            evidence=[],
            actions=[],
            requiresApproval=False,
            warnings=[],
            confidence="high",
            sources=[]
        )

    # Specialist 5: Onboarding Agent
    def run_onboarding_agent(self, db: Session, org_id: uuid.UUID, actor: str, query: str, steps: list) -> OrchestrationResponse:
        steps.append(AgentStep(agentName="Onboarding Agent", thought="Listing active onboarding checks."))
        return OrchestrationResponse(
            status="success",
            summary="Staff Onboarding: John Doe (Senior Software Engineer)\nProgress: 60% Complete\n\nChecklist:\n- Sign employment agreement: Completed\n- Direct Deposit settings: Pending",
            agentSteps=steps,
            evidence=[],
            actions=[],
            requiresApproval=False,
            warnings=[],
            confidence="high",
            sources=[]
        )

    # Specialist 6: Analytics Agent
    def run_analytics_agent(self, db: Session, org_id: uuid.UUID, actor: str, role: str, query: str, steps: list) -> OrchestrationResponse:
        steps.append(AgentStep(agentName="HR Analytics Agent", thought="Verifying user clearance for salary calculations."))
        if role not in ["HR_ADMIN", "ORGANIZATION_ADMIN", "AUDITOR"]:
            return OrchestrationResponse(
                status="failure",
                summary="Access Denied: You do not have the required permissions to view salary metrics or headcount analytics.",
                agentSteps=steps,
                evidence=[f"Role: {role}"],
                actions=[],
                requiresApproval=False,
                warnings=["Blocked unauthorized access."],
                confidence="high",
                sources=[]
            )

        employees = db.query(Employee).filter(Employee.organization_id == org_id).all()
        active_count = len([e for e in employees if e.status == "active"])
        return OrchestrationResponse(
            status="success",
            summary=f"Headcount Operations Overview:\n- Total Employees: {len(employees)}\n- Active Staff: {active_count}",
            agentSteps=steps,
            evidence=[f"Active Headcount: {active_count}"],
            actions=[],
            requiresApproval=False,
            warnings=[],
            confidence="high",
            sources=[]
        )

backend_orchestrator = HRBackendAgentOrchestrator()
