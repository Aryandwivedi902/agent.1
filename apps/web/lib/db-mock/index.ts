// HRFlow AI — Persistent Tenant-Isolated State Engine
// Simulates a relational database stored in localStorage (client) or in-memory (server fallback).

export interface Organization {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended';
}

export interface OrganizationSettings {
  organizationId: string;
  country: string;
  timezone: string;
  locale: string;
  currency: string;
  workingWeek: Record<string, boolean>;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'HR_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE' | 'AUDITOR';
  status: 'active' | 'inactive';
}

export interface Employee {
  id: string;
  organizationId: string;
  userId?: string;
  employeeIdNumber: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  jobTitle: string;
  department: string;
  salary: string; // Encrypted in DB, plain in authorized state
  bankAccount: string; // Encrypted in DB, plain in authorized state
  status: 'active' | 'leave' | 'terminated';
  startDate: string;
}

export interface EmployeeRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  requestType: 'leave' | 'payroll' | 'benefits' | 'equipment';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  comments: Array<{
    id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
}

export interface Policy {
  id: string;
  organizationId: string;
  title: string;
  summary: string;
  category: string;
  status: 'draft' | 'review' | 'published' | 'superseded' | 'archived';
  version: number;
  filePath: string;
  effectiveDate: string;
  createdAt: string;
  chunks: string[];
}

export interface Approval {
  id: string;
  organizationId: string;
  requestedBy: string;
  actionType: 'send_email' | 'update_employee_record' | 'export_data' | 'trigger_workflow';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  payload: any;
  evidence: string;
  warnings: string[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  organizationId: string;
  recruitmentJobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  matchScore: number;
  matchedCriteria: string[];
  missingCriteria: string[];
  notes: string;
  createdAt: string;
}

export interface OnboardingWorkflow {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  jobTitle: string;
  progress: number;
  tasks: Array<{
    id: string;
    title: string;
    assignedTo: 'employee' | 'hr' | 'manager';
    status: 'pending' | 'completed';
    requiredDoc?: string;
  }>;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  actor: string;
  actorType: 'user' | 'agent' | 'system';
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'denied';
  details: string;
  timestamp: string;
}

export interface IntegrationAccount {
  id: string;
  organizationId: string;
  providerName: string;
  status: 'connected' | 'disconnected';
  lastConnected: string;
}

// Initial Data Seeds
const seedOrganizations: Organization[] = [
  { id: 'org-acme', name: 'Acme Corporation', domain: 'acme.com', status: 'active' },
  { id: 'org-globex', name: 'Globex Corporation', domain: 'globex.co.uk', status: 'active' }
];

const seedSettings: OrganizationSettings[] = [
  {
    organizationId: 'org-acme',
    country: 'US',
    timezone: 'America/Los_Angeles',
    locale: 'en-US',
    currency: 'USD',
    workingWeek: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false }
  },
  {
    organizationId: 'org-globex',
    country: 'GB',
    timezone: 'Europe/London',
    locale: 'en-GB',
    currency: 'GBP',
    workingWeek: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false }
  }
];

const seedUsers: User[] = [
  { id: 'usr-alice', organizationId: 'org-acme', email: 'alice.vance@acme.com', firstName: 'Alice', lastName: 'Vance', role: 'HR_ADMIN', status: 'active' },
  { id: 'usr-bob', organizationId: 'org-acme', email: 'bob.miller@acme.com', firstName: 'Bob', lastName: 'Miller', role: 'HR_MANAGER', status: 'active' },
  { id: 'usr-john', organizationId: 'org-acme', email: 'john.doe@acme.com', firstName: 'John', lastName: 'Doe', role: 'EMPLOYEE', status: 'active' },
  { id: 'usr-david', organizationId: 'org-globex', email: 'david.bowman@globex.co.uk', firstName: 'David', lastName: 'Bowman', role: 'HR_ADMIN', status: 'active' }
];

const seedEmployees: Employee[] = [
  {
    id: 'emp-alice',
    organizationId: 'org-acme',
    userId: 'usr-alice',
    employeeIdNumber: 'EMP-001',
    firstName: 'Alice',
    lastName: 'Vance',
    workEmail: 'alice.vance@acme.com',
    jobTitle: 'HR Director',
    department: 'Human Resources',
    salary: '$125,000',
    bankAccount: 'US...4568',
    status: 'active',
    startDate: '2023-01-15'
  },
  {
    id: 'emp-bob',
    organizationId: 'org-acme',
    userId: 'usr-bob',
    employeeIdNumber: 'EMP-002',
    firstName: 'Bob',
    lastName: 'Miller',
    workEmail: 'bob.miller@acme.com',
    jobTitle: 'HR Coordinator',
    department: 'Human Resources',
    salary: '$85,000',
    bankAccount: 'US...7894',
    status: 'active',
    startDate: '2024-03-01'
  },
  {
    id: 'emp-john',
    organizationId: 'org-acme',
    userId: 'usr-john',
    employeeIdNumber: 'EMP-003',
    firstName: 'John',
    lastName: 'Doe',
    workEmail: 'john.doe@acme.com',
    jobTitle: 'Senior Software Engineer',
    department: 'Engineering',
    salary: '$150,000',
    bankAccount: 'US...2231',
    status: 'active',
    startDate: '2024-06-10'
  }
];

const seedRequests: EmployeeRequest[] = [
  {
    id: 'req-1',
    organizationId: 'org-acme',
    employeeId: 'emp-john',
    employeeName: 'John Doe',
    requestType: 'leave',
    title: 'Vacation Leave Request - 3 days',
    description: 'Hi HR team, requesting leave from October 12 to October 14 for a family trip. Thanks!',
    priority: 'medium',
    status: 'open',
    assignedTo: 'Bob Miller',
    createdAt: '2026-08-28T09:30:00Z',
    comments: [
      { id: 'c-1', author: 'Bob Miller', text: 'Checking PTO balances. John has 12 days remaining.', createdAt: '2026-08-28T10:15:00Z' }
    ]
  }
];

const seedPolicies: Policy[] = [
  {
    id: 'pol-1',
    organizationId: 'org-acme',
    title: 'Paid Time Off (PTO) Policy',
    summary: 'Details regarding time off accruals. Full-time staff accumulate 1.25 days of PTO monthly, totaling 15 days per year.',
    category: 'Time Off',
    status: 'published',
    version: 1,
    filePath: 'policies/acme_pto_v1.pdf',
    effectiveDate: '2025-01-01',
    createdAt: '2025-01-01T08:00:00Z',
    chunks: [
      'Acme Paid Time Off (PTO) Policy: Full time employees accrue PTO hours at a rate of 1.25 days per month, summing to a total of 15 days per year.',
      'Unused PTO carryover is permitted up to a maximum of 5 days into the next calendar year. Requests must be submitted at least two weeks in advance.'
    ]
  }
];

const seedApprovals: Approval[] = [
  {
    id: 'app-1',
    organizationId: 'org-acme',
    requestedBy: 'HR AI Manager (via Email Agent)',
    actionType: 'send_email',
    riskLevel: 'HIGH',
    status: 'pending',
    payload: {
      to: 'sarah.connor@gmail.com',
      subject: 'Interview Schedule Proposal - Acme Corp',
      body: 'Dear Sarah, we enjoyed reviewing your profile for the Senior Fullstack position. We would like to coordinate a phone interview this Wednesday at 2 PM EST. Please let us know if that works.'
    },
    evidence: 'Candidate matches 3 out of 4 Job Criteria constraints. Policy requires human confirmation for external candidate outreach.',
    warnings: ['Requires manual verification of calendar booking slot.'],
    createdAt: '2026-08-30T16:00:00Z'
  }
];

const seedCandidates: Candidate[] = [
  {
    id: 'can-1',
    organizationId: 'org-acme',
    recruitmentJobId: 'job-1',
    jobTitle: 'Senior Fullstack Engineer',
    firstName: 'Sarah',
    lastName: 'Connor',
    email: 'sarah.connor@gmail.com',
    status: 'screening',
    matchScore: 85,
    matchedCriteria: ['React & TypeScript expert', 'PostgreSQL database experience'],
    missingCriteria: ['5+ years Experience (candidate has 4.5 years)'],
    notes: 'Strong backend focus. Very articulate during preliminary text assessment.',
    createdAt: '2026-08-29T12:00:00Z'
  }
];

const seedOnboarding: OnboardingWorkflow[] = [
  {
    id: 'onb-1',
    organizationId: 'org-acme',
    employeeId: 'emp-john',
    employeeName: 'John Doe',
    jobTitle: 'Senior Software Engineer',
    progress: 60,
    tasks: [
      { id: 'ot-1', title: 'Sign employment agreement contract', assignedTo: 'employee', status: 'completed' },
      { id: 'ot-2', title: 'Submit proof of national identity card', assignedTo: 'employee', status: 'completed', requiredDoc: 'Passport/ID' },
      { id: 'ot-3', title: 'Setup bank direct-deposit coordinates', assignedTo: 'employee', status: 'pending', requiredDoc: 'Voided Check' },
      { id: 'ot-4', title: 'Complete compliance handbook reading confirmation', assignedTo: 'employee', status: 'pending' },
      { id: 'ot-5', title: 'Provision workstation hardware laptop', assignedTo: 'hr', status: 'completed' }
    ]
  }
];

const seedIntegrations: IntegrationAccount[] = [
  { id: 'int-google', organizationId: 'org-acme', providerName: 'Google Workspace', status: 'connected', lastConnected: '2026-08-27T10:00:00Z' },
  { id: 'int-slack', organizationId: 'org-acme', providerName: 'Slack Operations', status: 'disconnected', lastConnected: '' }
];

const seedAuditLogs: AuditLog[] = [
  {
    id: 'aud-1',
    organizationId: 'org-acme',
    actor: 'alice.vance@acme.com',
    actorType: 'user',
    action: 'USER_LOGIN',
    resource: 'auth',
    result: 'success',
    details: 'User successfully authenticated with MFA.',
    timestamp: '2026-08-30T17:00:00Z'
  }
];

// Database state container
class MockDatabase {
  private state: {
    organizations: Organization[];
    settings: OrganizationSettings[];
    users: User[];
    employees: Employee[];
    requests: EmployeeRequest[];
    policies: Policy[];
    approvals: Approval[];
    candidates: Candidate[];
    onboarding: OnboardingWorkflow[];
    integrations: IntegrationAccount[];
    auditLogs: AuditLog[];
  };

  constructor() {
    this.state = {
      organizations: seedOrganizations,
      settings: seedSettings,
      users: seedUsers,
      employees: seedEmployees,
      requests: seedRequests,
      policies: seedPolicies,
      approvals: seedApprovals,
      candidates: seedCandidates,
      onboarding: seedOnboarding,
      integrations: seedIntegrations,
      auditLogs: seedAuditLogs
    };

    this.loadFromStorage();
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private loadFromStorage() {
    if (!this.isClient()) return;
    try {
      const saved = localStorage.getItem('hrflow_db_state');
      if (saved) {
        this.state = JSON.parse(saved);
      } else {
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Failed to load DB state', e);
    }
  }

  private saveToStorage() {
    if (!this.isClient()) return;
    try {
      localStorage.setItem('hrflow_db_state', JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save DB state', e);
    }
  }

  public resetDatabase() {
    localStorage.removeItem('hrflow_db_state');
    this.state = {
      organizations: seedOrganizations,
      settings: seedSettings,
      users: seedUsers,
      employees: seedEmployees,
      requests: seedRequests,
      policies: seedPolicies,
      approvals: seedApprovals,
      candidates: seedCandidates,
      onboarding: seedOnboarding,
      integrations: seedIntegrations,
      auditLogs: seedAuditLogs
    };
    this.saveToStorage();
  }

  // --- QUERY APIS WITH STRICT TENANT CHECKS ---

  public getEmployees(orgId: string): Employee[] {
    this.loadFromStorage();
    return this.state.employees.filter(e => e.organizationId === orgId);
  }

  public addEmployee(orgId: string, employee: Omit<Employee, 'id' | 'organizationId'>, actorEmail: string): Employee {
    const newEmp: Employee = {
      ...employee,
      id: 'emp-' + Math.random().toString(36).substr(2, 9),
      organizationId: orgId
    };
    this.state.employees.push(newEmp);
    this.logAudit(orgId, actorEmail, 'user', 'CREATE_EMPLOYEE', 'employees', 'success', `Created employee profile for ${newEmp.firstName} ${newEmp.lastName}`);
    this.saveToStorage();
    return newEmp;
  }

  public getRequests(orgId: string): EmployeeRequest[] {
    this.loadFromStorage();
    return this.state.requests.filter(r => r.organizationId === orgId);
  }

  public addRequest(orgId: string, request: Omit<EmployeeRequest, 'id' | 'organizationId' | 'createdAt' | 'comments'>, actorEmail: string): EmployeeRequest {
    const newReq: EmployeeRequest = {
      ...request,
      id: 'req-' + Math.random().toString(36).substr(2, 9),
      organizationId: orgId,
      createdAt: new Date().toISOString(),
      comments: []
    };
    this.state.requests.unshift(newReq);
    this.logAudit(orgId, actorEmail, 'user', 'CREATE_REQUEST', 'employee_requests', 'success', `Submitted employee request: ${newReq.title}`);
    this.saveToStorage();
    return newReq;
  }

  public updateRequestStatus(orgId: string, requestId: string, status: EmployeeRequest['status'], actorEmail: string) {
    const req = this.state.requests.find(r => r.id === requestId && r.organizationId === orgId);
    if (req) {
      req.status = status;
      this.logAudit(orgId, actorEmail, 'user', 'UPDATE_REQUEST_STATUS', 'employee_requests', 'success', `Set request ${requestId} status to ${status}`);
      this.saveToStorage();
    }
  }

  public addRequestComment(orgId: string, requestId: string, author: string, text: string, actorEmail: string) {
    const req = this.state.requests.find(r => r.id === requestId && r.organizationId === orgId);
    if (req) {
      req.comments.push({
        id: 'c-' + Math.random().toString(36).substr(2, 9),
        author,
        text,
        createdAt: new Date().toISOString()
      });
      this.logAudit(orgId, actorEmail, 'user', 'ADD_REQUEST_COMMENT', 'employee_requests', 'success', `Added comment to request ${requestId}`);
      this.saveToStorage();
    }
  }

  public getPolicies(orgId: string): Policy[] {
    this.loadFromStorage();
    return this.state.policies.filter(p => p.organizationId === orgId);
  }

  public uploadPolicy(orgId: string, title: string, summary: string, category: string, chunks: string[], actorEmail: string): Policy {
    const newPol: Policy = {
      id: 'pol-' + Math.random().toString(36).substr(2, 9),
      organizationId: orgId,
      title,
      summary,
      category,
      status: 'published',
      version: 1,
      filePath: `policies/${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1.pdf`,
      effectiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      chunks
    };
    this.state.policies.push(newPol);
    this.logAudit(orgId, actorEmail, 'user', 'PUBLISH_POLICY', 'policies', 'success', `Uploaded & parsed policy document: ${title}`);
    this.saveToStorage();
    return newPol;
  }

  public getApprovals(orgId: string): Approval[] {
    this.loadFromStorage();
    return this.state.approvals.filter(a => a.organizationId === orgId);
  }

  public addApprovalRequest(orgId: string, requestedBy: string, actionType: Approval['actionType'], riskLevel: Approval['riskLevel'], payload: any, evidence: string, warnings: string[]): Approval {
    const newApp: Approval = {
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      organizationId: orgId,
      requestedBy,
      actionType,
      riskLevel,
      status: 'pending',
      payload,
      evidence,
      warnings,
      createdAt: new Date().toISOString()
    };
    this.state.approvals.unshift(newApp);
    this.logAudit(orgId, requestedBy, 'agent', 'REQUEST_APPROVAL', 'approvals', 'success', `Triggered approval workflow for ${actionType} (Risk: ${riskLevel})`);
    this.saveToStorage();
    return newApp;
  }

  public approveApproval(orgId: string, approvalId: string, actorEmail: string) {
    const app = this.state.approvals.find(a => a.id === approvalId && a.organizationId === orgId);
    if (app) {
      app.status = 'approved';
      this.logAudit(orgId, actorEmail, 'user', 'EXECUTE_APPROVAL', 'approvals', 'success', `Approved transaction ${approvalId}`);
      
      // Simulate action execution based on type
      if (app.actionType === 'send_email') {
        app.status = 'executed';
        this.logAudit(orgId, 'System Orchestrator', 'system', 'SEND_EMAIL', 'email', 'success', `Sent approved communication to ${app.payload.to}`);
      } else if (app.actionType === 'update_employee_record') {
        app.status = 'executed';
        // Simulate record update
        const emp = this.state.employees.find(e => e.id === app.payload.employeeId && e.organizationId === orgId);
        if (emp) {
          if (app.payload.salary) emp.salary = app.payload.salary;
          if (app.payload.jobTitle) emp.jobTitle = app.payload.jobTitle;
        }
        this.logAudit(orgId, 'System Orchestrator', 'system', 'UPDATE_EMPLOYEE', 'employees', 'success', `Updated record for employee ${app.payload.employeeId}`);
      }
      this.saveToStorage();
    }
  }

  public rejectApproval(orgId: string, approvalId: string, actorEmail: string) {
    const app = this.state.approvals.find(a => a.id === approvalId && a.organizationId === orgId);
    if (app) {
      app.status = 'rejected';
      this.logAudit(orgId, actorEmail, 'user', 'REJECT_APPROVAL', 'approvals', 'success', `Rejected transaction ${approvalId}`);
      this.saveToStorage();
    }
  }

  public getCandidates(orgId: string): Candidate[] {
    this.loadFromStorage();
    return this.state.candidates.filter(c => c.organizationId === orgId);
  }

  public addCandidate(orgId: string, candidate: Omit<Candidate, 'id' | 'organizationId' | 'createdAt'>, actorEmail: string): Candidate {
    const newCan: Candidate = {
      ...candidate,
      id: 'can-' + Math.random().toString(36).substr(2, 9),
      organizationId: orgId,
      createdAt: new Date().toISOString()
    };
    this.state.candidates.push(newCan);
    this.logAudit(orgId, actorEmail, 'user', 'CREATE_CANDIDATE', 'candidates', 'success', `Added candidate ${newCan.firstName} ${newCan.lastName} to pipeline`);
    this.saveToStorage();
    return newCan;
  }

  public updateCandidateStatus(orgId: string, candidateId: string, status: Candidate['status'], actorEmail: string) {
    const can = this.state.candidates.find(c => c.id === candidateId && c.organizationId === orgId);
    if (can) {
      can.status = status;
      this.logAudit(orgId, actorEmail, 'user', 'UPDATE_CANDIDATE_STATUS', 'candidates', 'success', `Set candidate ${candidateId} to ${status}`);
      this.saveToStorage();
    }
  }

  public getOnboarding(orgId: string): OnboardingWorkflow[] {
    this.loadFromStorage();
    return this.state.onboarding.filter(o => o.organizationId === orgId);
  }

  public toggleOnboardingTask(orgId: string, workflowId: string, taskId: string, actorEmail: string) {
    const workflow = this.state.onboarding.find(o => o.id === workflowId && o.organizationId === orgId);
    if (workflow) {
      const task = workflow.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed';
        
        // Recalculate progress
        const completed = workflow.tasks.filter(t => t.status === 'completed').length;
        workflow.progress = Math.round((completed / workflow.tasks.length) * 100);
        
        this.logAudit(orgId, actorEmail, 'user', 'TOGGLE_ONBOARDING_TASK', 'onboarding_tasks', 'success', `Toggled onboarding task ${taskId} in workflow ${workflowId}`);
        this.saveToStorage();
      }
    }
  }

  public getIntegrations(orgId: string): IntegrationAccount[] {
    this.loadFromStorage();
    return this.state.integrations.filter(i => i.organizationId === orgId);
  }

  public toggleIntegration(orgId: string, integrationId: string, actorEmail: string) {
    const int = this.state.integrations.find(i => i.id === integrationId && i.organizationId === orgId);
    if (int) {
      int.status = int.status === 'connected' ? 'disconnected' : 'connected';
      int.lastConnected = int.status === 'connected' ? new Date().toISOString() : '';
      this.logAudit(orgId, actorEmail, 'user', 'TOGGLE_INTEGRATION', 'integrations', 'success', `Toggled integration status of provider: ${int.providerName}`);
      this.saveToStorage();
    }
  }

  public getSettings(orgId: string): OrganizationSettings | undefined {
    this.loadFromStorage();
    return this.state.settings.find(s => s.organizationId === orgId);
  }

  public updateSettings(orgId: string, settings: Partial<OrganizationSettings>, actorEmail: string) {
    const cur = this.state.settings.find(s => s.organizationId === orgId);
    if (cur) {
      Object.assign(cur, settings);
      this.logAudit(orgId, actorEmail, 'user', 'UPDATE_SETTINGS', 'organization_settings', 'success', `Updated organizational localization settings.`);
      this.saveToStorage();
    }
  }

  public getAuditLogs(orgId: string): AuditLog[] {
    this.loadFromStorage();
    return this.state.auditLogs.filter(a => a.organizationId === orgId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public logAudit(
    orgId: string, 
    actor: string, 
    actorType: AuditLog['actorType'], 
    action: string, 
    resource: string, 
    result: AuditLog['result'], 
    details: string
  ) {
    const log: AuditLog = {
      id: 'aud-' + Math.random().toString(36).substr(2, 9),
      organizationId: orgId,
      actor,
      actorType,
      action,
      resource,
      result,
      details,
      timestamp: new Date().toISOString()
    };
    this.state.auditLogs.unshift(log);
    
    // Enforce retention limit (e.g. keep last 200 logs in mock storage)
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
    this.saveToStorage();
  }
}

export const db = new MockDatabase();
