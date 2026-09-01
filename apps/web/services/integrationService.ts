import { IntegrationDefinition } from '../types/workflow';

export const mockIntegrations: IntegrationDefinition[] = [
  {
    id: 'int-openai',
    name: 'OpenAI / LLM Compatible',
    category: 'AI',
    description: 'Connect to GPT-4o, Claude 3.5, Llama-3, or custom OpenAI-compatible endpoints.',
    iconName: 'Sparkles',
    isConnected: true,
    authType: 'API Key',
  },
  {
    id: 'int-slack',
    name: 'Slack Workspace',
    category: 'Communication',
    description: 'Send messages, listen to channel events, and trigger workflows via bot mention.',
    iconName: 'MessageSquare',
    isConnected: true,
    authType: 'OAuth2',
  },
  {
    id: 'int-postgres',
    name: 'PostgreSQL Database',
    category: 'Databases',
    description: 'Execute parameterized queries, insert records, and listen to notification triggers.',
    iconName: 'Database',
    isConnected: true,
    authType: 'Basic Auth',
  },
  {
    id: 'int-sheets',
    name: 'Google Sheets',
    category: 'Productivity',
    description: 'Append rows, update spreadsheets, and read structured data directly from Drive.',
    iconName: 'Table',
    isConnected: false,
    authType: 'OAuth2',
  },
  {
    id: 'int-notion',
    name: 'Notion Workspace',
    category: 'Productivity',
    description: 'Sync databases, update wiki pages, and retrieve structured workspace items.',
    iconName: 'FileText',
    isConnected: false,
    authType: 'OAuth2',
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot CRM',
    category: 'CRM',
    description: 'Manage deal pipelines, contact activity, and sync sales automation workflows.',
    iconName: 'Users',
    isConnected: true,
    authType: 'OAuth2',
  },
  {
    id: 'int-github',
    name: 'GitHub Repository',
    category: 'Developer Tools',
    description: 'Listen to PR webhooks, trigger CI/CD actions, and automate code review comments.',
    iconName: 'GitBranch',
    isConnected: true,
    authType: 'OAuth2',
  },
  {
    id: 'int-http',
    name: 'Custom REST API (HTTP)',
    category: 'Developer Tools',
    description: 'Connect to any external REST API using headers, bearer tokens, or basic auth.',
    iconName: 'Globe',
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
