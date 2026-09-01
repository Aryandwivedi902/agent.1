import { IntegrationDefinition } from '../types/workflow';

export const mockIntegrations: IntegrationDefinition[] = [
  {
    id: 'int-workday',
    name: 'Workday Human Capital',
    category: 'CRM',
    description: 'Sync employee profiles, department hierarchies, payroll changes, and job requisitions.',
    iconName: 'Users',
    isConnected: true,
    authType: 'OAuth2',
  },
  {
    id: 'int-bamboohr',
    name: 'BambooHR',
    category: 'Productivity',
    description: 'Track PTO requests, time-off balances, employee directories, and emergency contacts.',
    iconName: 'FileText',
    isConnected: true,
    authType: 'API Key',
  },
  {
    id: 'int-greenhouse',
    name: 'Greenhouse ATS',
    category: 'Productivity',
    description: 'Listen to candidate webhooks, advance interview stages, and import candidate resumes.',
    iconName: 'GitBranch',
    isConnected: true,
    authType: 'OAuth2',
  },
  {
    id: 'int-slack-hr',
    name: 'Slack HR Help Desk',
    category: 'Communication',
    description: 'Deploy HR Bot to answer employee benefit questions and receive automated ticket notifications.',
    iconName: 'MessageSquare',
    isConnected: true,
    authType: 'OAuth2',
  },
  {
    id: 'int-docusign',
    name: 'DocuSign e-Signatures',
    category: 'Productivity',
    description: 'Automate offer letter dispatch, NDA execution, and tax compliance form signatures.',
    iconName: 'FileText',
    isConnected: true,
    authType: 'OAuth2',
  },
  {
    id: 'int-rippling',
    name: 'Rippling Payroll & IT',
    category: 'Developer Tools',
    description: 'Automate laptop shipping, Google Workspace account creation, and payroll tax filing.',
    iconName: 'Globe',
    isConnected: true,
    authType: 'API Key',
  },
  {
    id: 'int-postgres-hr',
    name: 'HR Data Warehouse (Postgres)',
    category: 'Databases',
    description: 'Execute analytical queries over employee tenure, performance reviews, and salary records.',
    iconName: 'Database',
    isConnected: true,
    authType: 'Basic Auth',
  },
  {
    id: 'int-openai-hr',
    name: 'OpenAI HR Language Model',
    category: 'AI',
    description: 'Specialized LLM endpoint fine-tuned for employee policy interpretation and resume parsing.',
    iconName: 'Sparkles',
    isConnected: true,
    authType: 'API Key',
  },
];

export const integrationService = {
  async getIntegrations(): Promise<IntegrationDefinition[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockIntegrations;
  },
};
