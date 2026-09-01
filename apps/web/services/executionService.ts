import { ExecutionRecord } from '../types/workflow';

export const mockExecutions: ExecutionRecord[] = [
  {
    id: 'exec-98201',
    workflowId: 'wf-customer-support-01',
    workflowName: 'Customer Support AI Agent',
    status: 'success',
    startedAt: '2 minutes ago (05:10:14)',
    durationMs: 1852,
    itemsProcessed: 1,
    triggerType: 'Webhook POST',
    logs: [
      { nodeId: 'node-webhook', nodeName: 'Webhook Trigger', status: 'success', durationMs: 24, timestamp: '05:10:14' },
      { nodeId: 'node-extract', nodeName: 'Extract User Message', status: 'success', durationMs: 38, timestamp: '05:10:14' },
      { nodeId: 'node-ai-agent', nodeName: 'AI Support Agent', status: 'success', durationMs: 1240, timestamp: '05:10:15' },
      { nodeId: 'node-knowledge', nodeName: 'Knowledge Base Search', status: 'success', durationMs: 420, timestamp: '05:10:15' },
      { nodeId: 'node-decision', nodeName: 'Confidence Decision', status: 'success', durationMs: 18, timestamp: '05:10:16' },
      { nodeId: 'node-reply', nodeName: 'Send Customer Reply', status: 'success', durationMs: 110, timestamp: '05:10:16' },
    ],
  },
  {
    id: 'exec-98200',
    workflowId: 'wf-lead-qualifier-02',
    workflowName: 'Lead Qualification Agent',
    status: 'success',
    startedAt: '15 minutes ago (04:57:01)',
    durationMs: 2410,
    itemsProcessed: 4,
    triggerType: 'Schedule Cron',
    logs: [],
  },
  {
    id: 'exec-98199',
    workflowId: 'wf-customer-support-01',
    workflowName: 'Customer Support AI Agent',
    status: 'failed',
    startedAt: '28 minutes ago (04:44:12)',
    durationMs: 620,
    itemsProcessed: 1,
    triggerType: 'Webhook POST',
    logs: [
      { nodeId: 'node-webhook', nodeName: 'Webhook Trigger', status: 'success', durationMs: 20, timestamp: '04:44:12' },
      { nodeId: 'node-extract', nodeName: 'Extract User Message', status: 'error', durationMs: 600, timestamp: '04:44:13', errorDetails: 'KeyError: Malformed JSON body in request payload' },
    ],
  },
  {
    id: 'exec-98198',
    workflowId: 'wf-onboarding-sync-04',
    workflowName: 'Employee Onboarding Checklist',
    status: 'success',
    startedAt: '1 hour ago (04:12:00)',
    durationMs: 3820,
    itemsProcessed: 12,
    triggerType: 'Manual Trigger',
    logs: [],
  },
];

export const executionService = {
  async getExecutions(): Promise<ExecutionRecord[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockExecutions;
  },
};
