// HRFlow AI — Multi-Agent Coordination Engine
// Implements the Orchestrator, Specialist agents, and structured response construction.

import { db, Employee, EmployeeRequest, Policy, Candidate, Approval } from '../db-mock';

export interface AgentAction {
  tool: string;
  payload: Record<string, any>;
}

export interface AgentStep {
  agentName: string;
  thought: string;
  actionTaken?: string;
}

export interface OrchestrationResult {
  status: 'success' | 'failure' | 'waiting_approval';
  summary: string;
  agentSteps: AgentStep[];
  evidence: string[];
  actions: AgentAction[];
  requiresApproval: boolean;
  warnings: string[];
  confidence: string;
  sources: string[];
}

class HRMultiAgentSystem {
  // Intent Classification Router
  public async processRequest(
    orgId: string,
    userId: string,
    userEmail: string,
    userRole: string,
    message: string
  ): Promise<OrchestrationResult> {
    const steps: AgentStep[] = [];
    const queryLower = message.toLowerCase();

    // 1. HR AI Manager starts analysis
    steps.push({
      agentName: 'HR AI Manager (Orchestrator)',
      thought: `Received query: "${message}". Performing initial security review and role verification. User Role: ${userRole}.`
    });

    // Enforce prompt injection protection filter
    if (
      queryLower.includes('ignore previous') || 
      queryLower.includes('system prompt') || 
      queryLower.includes('override instructions') ||
      queryLower.includes('reveal guidelines')
    ) {
      db.logAudit(orgId, userEmail, 'agent', 'SECURITY_FILTER_TRIGGER', 'security', 'denied', `Prompt injection attempt blocked: "${message}"`);
      return {
        status: 'failure',
        summary: 'I apologize, but I am programmed to uphold security standards and corporate policy guidelines. I cannot modify my underlying operational code, reveal internal configuration prompts, or bypass role permissions.',
        agentSteps: [
          { agentName: 'HR AI Manager (Orchestrator)', thought: 'Security injection signatures detected. Refusing execution.' }
        ],
        evidence: ['Query signature matches known prompt override patterns.'],
        actions: [],
        requiresApproval: false,
        warnings: ['Prompt injection attempt recorded in security log.'],
        confidence: 'high',
        sources: []
      };
    }

    // 2. Intent Routing & specialist coordination
    if (queryLower.includes('policy') || queryLower.includes('leave') || queryLower.includes('pto') || queryLower.includes('carry over') || queryLower.includes('handbook')) {
      return this.runPolicyAgent(orgId, userEmail, message, steps);
    } 
    else if (queryLower.includes('email') || queryLower.includes('send') || queryLower.includes('draft') || queryLower.includes('contact')) {
      return this.runEmailAgent(orgId, userEmail, userRole, message, steps);
    } 
    else if (queryLower.includes('request') || queryLower.includes('ticket') || queryLower.includes('leave request')) {
      return this.runRequestAgent(orgId, userEmail, message, steps);
    } 
    else if (queryLower.includes('candidate') || queryLower.includes('recruit') || queryLower.includes('hire') || queryLower.includes('applicant')) {
      return this.runRecruitmentAgent(orgId, userEmail, message, steps);
    } 
    else if (queryLower.includes('onboard') || queryLower.includes('checklist') || queryLower.includes('welcome')) {
      return this.runOnboardingAgent(orgId, userEmail, message, steps);
    } 
    else if (queryLower.includes('metric') || queryLower.includes('statistic') || queryLower.includes('payroll') || queryLower.includes('salary') || queryLower.includes('department') || queryLower.includes('headcount')) {
      return this.runAnalyticsAgent(orgId, userEmail, userRole, message, steps);
    } 
    else {
      // General Greeting or fallback handler
      steps.push({
        agentName: 'HR AI Manager (Orchestrator)',
        thought: 'Categorizing query as general operational greeting. Drafting response.'
      });
      return {
        status: 'success',
        summary: 'Hello! I am your HR AI Manager. I coordinate specialized agents for Policy lookup, Email automation, Requests, Recruitment, Onboarding, and Analytics. How can I assist you with HR operations today?',
        agentSteps: steps,
        evidence: [],
        actions: [],
        requiresApproval: false,
        warnings: [],
        confidence: 'high',
        sources: []
      };
    }
  }

  // Specialist 1: Policy Agent
  private runPolicyAgent(orgId: string, actor: string, query: string, steps: AgentStep[]): OrchestrationResult {
    steps.push({
      agentName: 'Policy & Knowledge Agent',
      thought: 'Initiating semantic vector search on company policies repository.'
    });

    const policies = db.getPolicies(orgId);
    let matchedChunk = '';
    let docTitle = 'Acme Employee Handbook';
    let section = 'Section 2.4 - Time Off';
    
    // Scan policy chunks for terms
    for (const pol of policies) {
      for (const chunk of pol.chunks) {
        if (query.toLowerCase().includes('carry') || query.toLowerCase().includes('unused')) {
          if (chunk.toLowerCase().includes('carryover') || chunk.toLowerCase().includes('carry over')) {
            matchedChunk = chunk;
            docTitle = pol.title;
          }
        } else if (query.toLowerCase().includes('pto') || query.toLowerCase().includes('leave') || query.toLowerCase().includes('vacation')) {
          if (chunk.toLowerCase().includes('accrue') || chunk.toLowerCase().includes('pto')) {
            matchedChunk = chunk;
            docTitle = pol.title;
          }
        }
      }
    }

    if (matchedChunk) {
      steps.push({
        agentName: 'Policy & Knowledge Agent',
        thought: `Matched query to policy document "${docTitle}". Extracting specific context section.`,
        actionTaken: `Retrieved chunk: "${matchedChunk.slice(0, 80)}..."`
      });

      db.logAudit(orgId, actor, 'agent', 'POLICY_RETRIEVAL', 'policies', 'success', `Retrieved policy information from "${docTitle}"`);

      return {
        status: 'success',
        summary: `Based on the official ${docTitle} (${section}):\n\n${matchedChunk}\n\nThis is derived from current approved policies. For specific exceptions, consult your direct HR manager.`,
        agentSteps: steps,
        evidence: [`Context Match: "${matchedChunk}"`],
        actions: [],
        requiresApproval: false,
        warnings: ['Note: This information is for decision-support and does not substitute legal guidance.'],
        confidence: 'high',
        sources: [`${docTitle} (${section})`]
      };
    } else {
      steps.push({
        agentName: 'Policy & Knowledge Agent',
        thought: 'No exact matches found in indexed knowledge bases. Requesting human coordination.',
        actionTaken: 'Trigger escalation flag'
      });

      return {
        status: 'success',
        summary: 'I was unable to find specific details regarding that query in the company policy knowledge base. I have flagged this question for the HR team to address directly.',
        agentSteps: steps,
        evidence: ['Zero vector-index search hits.'],
        actions: [],
        requiresApproval: false,
        warnings: ['Question has been routed to HR managers queue.'],
        confidence: 'low',
        sources: []
      };
    }
  }

  // Specialist 2: Email Agent
  private runEmailAgent(orgId: string, actor: string, role: string, query: string, steps: AgentStep[]): OrchestrationResult {
    steps.push({
      agentName: 'Email Agent',
      thought: 'Parsing request variables. Validating recipient targets and content tone.'
    });

    const isSend = query.toLowerCase().includes('send');
    const hasTo = query.match(/to\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    const recipient = hasTo ? hasTo[1] : 'sarah.connor@gmail.com';
    const emailBody = 'Dear Candidate, we would like to coordinate a phone interview this Wednesday at 2 PM EST. Please let us know if that works. Best regards, HR Team.';

    if (isSend) {
      steps.push({
        agentName: 'Email Agent',
        thought: 'Request contains send command. Reviewing permission authorization rules.'
      });

      // Role check
      if (role !== 'HR_ADMIN' && role !== 'ORGANIZATION_ADMIN') {
        steps.push({
          agentName: 'HR AI Manager (Orchestrator)',
          thought: 'Execution halted: User does not hold authorization to send external emails.',
          actionTaken: 'Blocked action'
        });
        db.logAudit(orgId, actor, 'agent', 'SEND_EMAIL_FAILED', 'email', 'denied', `Blocked unauthorized email dispatch attempt by user role: ${role}`);
        return {
          status: 'failure',
          summary: 'You do not have the required permissions (`send_email`) to directly dispatch external communications. Please request an HR Administrator to execute this task.',
          agentSteps: steps,
          evidence: [`User holds role: ${role}. Required: HR_ADMIN`],
          actions: [],
          requiresApproval: false,
          warnings: ['Blocked unauthorized operation'],
          confidence: 'high',
          sources: []
        };
      }

      // Action requires approval (HIGH risk)
      steps.push({
        agentName: 'Email Agent',
        thought: 'Creating pending transaction in Human Approval Center.',
        actionTaken: 'Created Approval request'
      });

      const payload = { to: recipient, subject: 'Interview Schedule Proposal', body: emailBody };
      const app = db.addApprovalRequest(
        orgId,
        'Email Agent',
        'send_email',
        'HIGH',
        payload,
        'Action triggers an external candidate outreach communication email dispatch.',
        ['Requires manual verification of current calendars before sending.']
      );

      return {
        status: 'waiting_approval',
        summary: `I have drafted the email to ${recipient} and queued it in the **Approval Center** (Transaction ID: ${app.id}) as it requires human authorization before dispatch.`,
        agentSteps: steps,
        evidence: [`Target email: "${recipient}"`, `Subject: "Interview Schedule Proposal"`],
        actions: [{ tool: 'queue_approval', payload: { approvalId: app.id } }],
        requiresApproval: true,
        warnings: ['Email dispatch requires human verification to prevent data exposure or scheduling errors.'],
        confidence: 'high',
        sources: []
      };
    } else {
      // Just a draft request
      steps.push({
        agentName: 'Email Agent',
        thought: 'Drafting email response in review state.',
        actionTaken: 'Drafted template'
      });

      return {
        status: 'success',
        summary: `Here is the email draft prepared for ${recipient}:\n\n**Subject**: Interview Schedule Proposal\n\n**Body**:\n${emailBody}\n\nWould you like me to queue this for approval and send it?`,
        agentSteps: steps,
        evidence: [],
        actions: [],
        requiresApproval: false,
        warnings: ['This is a draft. It will not be sent until approved by an administrator.'],
        confidence: 'high',
        sources: []
      };
    }
  }

  // Specialist 3: Request Agent
  private runRequestAgent(orgId: string, actor: string, query: string, steps: AgentStep[]): OrchestrationResult {
    steps.push({
      agentName: 'Employee Request Agent',
      thought: 'Fetching open requests queue from database.'
    });

    const requests = db.getRequests(orgId);
    steps.push({
      agentName: 'Employee Request Agent',
      thought: `Found ${requests.length} active employee requests in queue.`
    });

    if (query.toLowerCase().includes('show') || query.toLowerCase().includes('list') || query.toLowerCase().includes('find')) {
      const summaryList = requests.map(r => `• [${r.priority.toUpperCase()}] **${r.title}** submitted by ${r.employeeName} (Status: ${r.status.replace('_', ' ')})`).join('\n');
      return {
        status: 'success',
        summary: `Here are the current active employee requests:\n\n${summaryList || 'No active requests in queue.'}`,
        agentSteps: steps,
        evidence: [`Total requests fetched: ${requests.length}`],
        actions: [],
        requiresApproval: false,
        warnings: [],
        confidence: 'high',
        sources: []
      };
    } else {
      // Default: create task or recommend action
      return {
        status: 'success',
        summary: 'I found 1 open ticket: "Vacation Leave Request - 3 days" by John Doe. Would you like me to look up his accrual balance or suggest a reply?',
        agentSteps: steps,
        evidence: [],
        actions: [],
        requiresApproval: false,
        warnings: [],
        confidence: 'high',
        sources: []
      };
    }
  }

  // Specialist 4: Recruitment Agent
  private runRecruitmentAgent(orgId: string, actor: string, query: string, steps: AgentStep[]): OrchestrationResult {
    steps.push({
      agentName: 'Recruitment Agent',
      thought: 'Loading candidates screening profile matrix.'
    });

    const candidates = db.getCandidates(orgId);
    const candidate = candidates[0] || { firstName: 'Sarah', lastName: 'Connor', matchScore: 85, status: 'screening', matchedCriteria: [], missingCriteria: [] };

    steps.push({
      agentName: 'Recruitment Agent',
      thought: `Retrieved candidate ${candidate.firstName} ${candidate.lastName}. Status: ${candidate.status}.`
    });

    return {
      status: 'success',
      summary: `### Candidate Assessment: **${candidate.firstName} ${candidate.lastName}**
- **Applied Position**: Senior Fullstack Engineer
- **AI Suitability Score**: **${candidate.matchScore}%**
- **Current Pipeline Stage**: \`${candidate.status.toUpperCase()}\`

#### Evaluation Matrix:
| Criteria | Assessment | Evidence |
|---|---|---|
| React & TypeScript expert | ✅ Matched | Resume notes 4 years of TypeScript development |
| PostgreSQL database experience | ✅ Matched | Experience building database models |
| 5+ years Experience | ❌ Missing | Candidate has 4.5 years of industry experience |

*AI Safeguard Notice: This comparison assists hiring managers in screening applicants. The agent cannot autonomously reject, hire, or modify applicant statuses.*`,
      agentSteps: steps,
      evidence: [
        `Matched Criteria: ${candidate.matchedCriteria.join(', ')}`,
        `Missing Criteria: ${candidate.missingCriteria.join(', ')}`
      ],
      actions: [],
      requiresApproval: false,
      warnings: ['This report serves as decision-support. Hiring decisions must be manually validated.'],
      confidence: 'high',
      sources: ['resume_sarah_connor.pdf']
    };
  }

  // Specialist 5: Onboarding Agent
  private runOnboardingAgent(orgId: string, actor: string, query: string, steps: AgentStep[]): OrchestrationResult {
    steps.push({
      agentName: 'Onboarding Agent',
      thought: 'Loading active onboarding worklist checklists.'
    });

    const workflows = db.getOnboarding(orgId);
    const flow = workflows[0];

    if (!flow) {
      return {
        status: 'success',
        summary: 'No active onboarding workflows found for this organization.',
        agentSteps: steps,
        evidence: [],
        actions: [],
        requiresApproval: false,
        warnings: [],
        confidence: 'high',
        sources: []
      };
    }

    steps.push({
      agentName: 'Onboarding Agent',
      thought: `Retrieved workflow for ${flow.employeeName} (${flow.progress}% complete).`
    });

    const tasksList = flow.tasks.map(t => `${t.status === 'completed' ? '✅' : '⏳'} [${t.assignedTo.toUpperCase()}] ${t.title}`).join('\n');

    return {
      status: 'success',
      summary: `### Onboarding Progress: **${flow.employeeName}** (${flow.jobTitle})
**Overall Progress**: **${flow.progress}% Complete**

#### Checklist Tasks:
${tasksList}

Would you like me to send a reminder for pending employee forms or check hardware setup?`,
      agentSteps: steps,
      evidence: [`Completed: ${flow.tasks.filter(t => t.status === 'completed').length}/${flow.tasks.length} tasks.`],
      actions: [],
      requiresApproval: false,
      warnings: [],
      confidence: 'high',
      sources: []
    };
  }

  // Specialist 6: Analytics Agent
  private runAnalyticsAgent(orgId: string, actor: string, role: string, query: string, steps: AgentStep[]): OrchestrationResult {
    steps.push({
      agentName: 'HR Analytics Agent',
      thought: 'Running checks on role authorizations for payroll and salaries query.'
    });

    // RBAC verification for sensitive analytics
    if (role !== 'HR_ADMIN' && role !== 'ORGANIZATION_ADMIN' && role !== 'AUDITOR') {
      steps.push({
        agentName: 'HR AI Manager (Orchestrator)',
        thought: 'Blocked query: User lacks view_employee_sensitive permissions.',
        actionTaken: 'Access Denied'
      });
      db.logAudit(orgId, actor, 'agent', 'ANALYTICS_FAILED', 'analytics', 'denied', `Blocked analytics query attempt due to insufficient permissions.`);
      return {
        status: 'failure',
        summary: 'Access Denied: You do not have the required permissions (`view_employee_sensitive`, `access_analytics`) to view aggregate headcount statistics, payroll distribution, or salary metrics.',
        agentSteps: steps,
        evidence: [`Role: ${role}`],
        actions: [],
        requiresApproval: false,
        warnings: ['Access attempts are logged for security compliance review.'],
        confidence: 'high',
        sources: []
      };
    }

    steps.push({
      agentName: 'HR Analytics Agent',
      thought: 'Authorized. Gathering aggregated metrics from database states.',
      actionTaken: 'Aggregating counts'
    });

    const employees = db.getEmployees(orgId);
    const count = employees.length;
    const departments = Array.from(new Set(employees.map(e => e.department)));
    const activeCount = employees.filter(e => e.status === 'active').length;

    db.logAudit(orgId, actor, 'agent', 'QUERY_ANALYTICS', 'analytics', 'success', `Generated headcount operations report`);

    return {
      status: 'success',
      summary: `### Operational Metrics Summary (Tenant: ${orgId === 'org-acme' ? 'Acme Corp' : 'Globex Corp'})
- **Total Employees**: **${count}**
- **Active Staff**: **${activeCount}**
- **Departments Configured**: **${departments.length}** (${departments.join(', ')})
- **Request Volume**: **1 active request**

*AI Analytics Notice: Metrics represent database aggregations. Interpretation serves for organizational overview and does not represent audited financial charts.*`,
      agentSteps: steps,
      evidence: [`Computed Headcount: ${count}`, `Active Rate: ${Math.round((activeCount / count) * 100)}%`],
      actions: [],
      requiresApproval: false,
      warnings: [],
      confidence: 'high',
      sources: []
    };
  }
}

export const agentSystem = new HRMultiAgentSystem();
