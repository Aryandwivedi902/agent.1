import { AIAgentDefinition } from '../types/workflow';

export const mockAgents: AIAgentDefinition[] = [
  {
    id: 'agent-cs',
    name: 'Customer Support Autonomous Agent',
    description: 'Uses AI and vector knowledge base to resolve customer queries 24/7.',
    avatar: '🤖',
    model: 'GPT-4o (OpenAI Compatible)',
    tools: ['Knowledge Base', 'CRM Lookup', 'Zendesk Ticket Creator', 'Email Transporter'],
    status: 'active',
    systemPrompt: 'Evaluate customer sentiment, cite official documentation, and issue automated responses.',
    runsCount: 14230,
  },
  {
    id: 'agent-sales',
    name: 'B2B Sales SDR Agent',
    description: 'Screens prospect profiles, checks company size, and crafts personalized outreach emails.',
    avatar: '🎯',
    model: 'Claude 3.5 Sonnet (Anthropic)',
    tools: ['LinkedIn Scraper', 'Apollo.io API', 'Calendar Scheduler'],
    status: 'active',
    systemPrompt: 'Extract key decision maker info and schedule 15 min introductory discovery calls.',
    runsCount: 8932,
  },
  {
    id: 'agent-code',
    name: 'Code Review & Security Auditor Agent',
    description: 'Performs static analysis on GitHub PRs, checks vulnerabilities, and suggests refactoring.',
    avatar: '🛡️',
    model: 'DeepSeek-Coder v2',
    tools: ['GitHub API', 'SonarQube Scanner', 'Slack Alerting'],
    status: 'active',
    systemPrompt: 'Scan pull request diffs for OWASP Top 10 vulnerabilities and output markdown inline comments.',
    runsCount: 3410,
  },
  {
    id: 'agent-finance',
    name: 'Invoice & Expense Reconciliation Agent',
    description: 'Parses PDF receipts, validates tax compliance, and posts entries to QuickBooks.',
    avatar: '📊',
    model: 'GPT-4o Vision',
    tools: ['OCR Vision Parser', 'QuickBooks API', 'Bank Feed Sync'],
    status: 'inactive',
    systemPrompt: 'Extract total, line items, VAT, merchant metadata, and route for manager approval if > $1,000.',
    runsCount: 920,
  },
];

export const agentService = {
  async getAgents(): Promise<AIAgentDefinition[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockAgents;
  },
};
