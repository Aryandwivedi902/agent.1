import { WorkflowDefinition } from '../types/workflow';

export const mockWorkflows: WorkflowDefinition[] = [
  {
    id: 'wf-customer-support-01',
    name: 'Customer Support AI Agent',
    description: 'Autonomously answers product inquiries and escalates complex tickets',
    status: 'published',
    lastRun: '2 minutes ago',
    successRate: '98.4%',
    totalRuns: 12430,
    updatedAt: 'Today, 04:12 PM',
    category: 'Customer Support',
  },
  {
    id: 'wf-lead-qualifier-02',
    name: 'Lead Qualification Agent',
    description: 'Enriches inbound leads via Apollo/Hubspot and schedules calendar slots',
    status: 'published',
    lastRun: '15 minutes ago',
    successRate: '96.2%',
    totalRuns: 8932,
    updatedAt: 'Yesterday',
    category: 'Sales & Marketing',
  },
  {
    id: 'wf-daily-report-03',
    name: 'Daily Executive Digest',
    description: 'Aggregates metrics across Postgres, Stripe & Posthog into Slack',
    status: 'draft',
    lastRun: 'Never Run',
    successRate: '—',
    totalRuns: 0,
    updatedAt: 'Today',
    category: 'Analytics',
  },
  {
    id: 'wf-onboarding-sync-04',
    name: 'Employee Onboarding Checklist',
    description: 'Triggers workstation setup, Slack invite, and handbook signoffs',
    status: 'published',
    lastRun: '1 hour ago',
    successRate: '100%',
    totalRuns: 412,
    updatedAt: '3 days ago',
    category: 'HR & Ops',
  },
  {
    id: 'wf-bug-triage-05',
    name: 'Sentry Bug Auto-Triage',
    description: 'Extracts error stacktraces and creates prioritized Jira tickets',
    status: 'archived',
    lastRun: '4 days ago',
    successRate: '92.1%',
    totalRuns: 1840,
    updatedAt: 'Last week',
    category: 'Engineering',
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
      id: `wf-${Date.now()}`,
      name,
      description,
      status: 'draft',
      lastRun: 'Never',
      successRate: '—',
      totalRuns: 0,
      updatedAt: 'Just now',
    };
    mockWorkflows.unshift(newWf);
    return newWf;
  },
};
