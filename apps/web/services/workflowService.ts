import { WorkflowDefinition } from '../types/workflow';

export const mockWorkflows: WorkflowDefinition[] = [
  {
    id: 'wf-hr-recruitment-01',
    name: 'Candidate Resume Screening & Onboarding Agent',
    description: 'Evaluates inbound engineering & sales resumes against open job reqs and schedules interviews',
    status: 'published',
    lastRun: '2 minutes ago',
    successRate: '98.4%',
    totalRuns: 12430,
    updatedAt: 'Today, 04:12 PM',
    category: 'Talent Acquisition',
  },
  {
    id: 'wf-hr-onboarding-02',
    name: 'New Hire Onboarding & Equipment Provisioning',
    description: 'Coordinates I-9 verification, handbook signoffs, Slack invites, and IT laptop provisioning',
    status: 'published',
    lastRun: '15 minutes ago',
    successRate: '99.1%',
    totalRuns: 8932,
    updatedAt: 'Yesterday',
    category: 'Employee Onboarding',
  },
  {
    id: 'wf-hr-pto-03',
    name: 'PTO & Benefits Policy AI Inquiry Desk',
    description: 'Answers employee questions about parental leave, 401k match, and medical benefits 24/7',
    status: 'published',
    lastRun: '1 hour ago',
    successRate: '97.5%',
    totalRuns: 4520,
    updatedAt: 'Today',
    category: 'HR Operations',
  },
  {
    id: 'wf-hr-payroll-04',
    name: 'Payroll Change Compliance Audit',
    description: 'Verifies monthly salary adjustment requests and compensation band changes against approval rules',
    status: 'draft',
    lastRun: 'Never Run',
    successRate: '—',
    totalRuns: 0,
    updatedAt: '3 days ago',
    category: 'Payroll & Compensation',
  },
  {
    id: 'wf-hr-performance-05',
    name: 'Quarterly Performance Review Reminder System',
    description: 'Automates self-review collection and peer feedback prompts across Slack and Workday',
    status: 'published',
    lastRun: '4 days ago',
    successRate: '95.8%',
    totalRuns: 1840,
    updatedAt: 'Last week',
    category: 'Performance & Talent',
  },
];

export const workflowService = {
  async getWorkflows(): Promise<WorkflowDefinition[]> {
    await new Promise((r) => setTimeout(r, 200));
    return mockWorkflows;
  },
  async getWorkflowById(id: string): Promise<WorkflowDefinition | undefined> {
    return mockWorkflows.find((w) => w.id === id);
  },
  async createWorkflow(name: string, description: string): Promise<WorkflowDefinition> {
    const newWf: WorkflowDefinition = {
      id: `wf-hr-${Date.now()}`,
      name,
      description,
      status: 'draft',
      lastRun: 'Never',
      successRate: '—',
      totalRuns: 0,
      updatedAt: 'Just now',
      category: 'HR Operations',
    };
    mockWorkflows.unshift(newWf);
    return newWf;
  },
};
