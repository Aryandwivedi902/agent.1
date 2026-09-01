import { AIAgentDefinition } from '../types/workflow';

export const mockAgents: AIAgentDefinition[] = [
  {
    id: 'agent-hr-recruitment',
    name: 'Recruitment & Candidate Screening Agent',
    description: 'Evaluates applicant resumes against job requirements, parses technical experience, and schedules interviews.',
    avatar: '🎯',
    model: 'GPT-4o (HR Specialized)',
    tools: ['Greenhouse ATS', 'Workday API', 'LinkedIn Recraper', 'Calendly Scheduler'],
    status: 'active',
    systemPrompt: 'Evaluate candidate qualifications against open requisitions. Detail matching skills and flag salary band mismatches.',
    runsCount: 14230,
  },
  {
    id: 'agent-hr-onboarding',
    name: 'Employee Onboarding Coordinator Agent',
    description: 'Guides new hires through document submission (I-9, W-4, NDA), provisions IT accounts, and monitors checklist progression.',
    avatar: '📋',
    model: 'Claude 3.5 Sonnet (HR Edition)',
    tools: ['BambooHR API', 'Okta Identity', 'Slack HR Bot', 'DocuSign'],
    status: 'active',
    systemPrompt: 'Track onboarding checklist tasks. Remind employees of pending compliance documents without autonomous bypass.',
    runsCount: 8932,
  },
  {
    id: 'agent-hr-policy',
    name: 'Policy & Benefits Knowledge Assistant',
    description: 'Provides 24/7 confidential answers to employee inquiries regarding PTO accrual, parental leave, health insurance, and 401k match.',
    avatar: '🤖',
    model: 'GPT-4o Policy Engine',
    tools: ['HR Knowledge Base', 'BambooHR PTO API', 'Zendesk HR Desk'],
    status: 'active',
    systemPrompt: 'Answer policy questions strictly based on verified HR handbook context. Cite section numbers and escalate confidential cases.',
    runsCount: 4520,
  },
  {
    id: 'agent-hr-analytics',
    name: 'HR Analytics & Compensation Audit Agent',
    description: 'Monitors turnover risks, headcount growth, salary equity across departments, and compliance audit logs.',
    avatar: '📊',
    model: 'DeepSeek Analytics v2',
    tools: ['Workday Payroll DB', 'PostgreSQL HR Store', 'QuickBooks API'],
    status: 'active',
    systemPrompt: 'Calculate attrition rates, salary compression ratios, and flag unapproved compensation revisions.',
    runsCount: 1840,
  },
];

export const agentService = {
  async getAgents(): Promise<AIAgentDefinition[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockAgents;
  },
};
