export type NodeCategory = 'trigger' | 'ai' | 'logic' | 'integration' | 'output';

export type NodeExecutionStatus = 'idle' | 'running' | 'success' | 'error' | 'waiting';

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  category: NodeCategory;
  typeId: string;
  iconName: string;
  description: string;
  status: NodeExecutionStatus;
  executionTimeMs?: number;
  config: {
    model?: string;
    systemPrompt?: string;
    userInput?: string;
    temperature?: number;
    tools?: string[];
    memory?: string;
    webhookUrl?: string;
    method?: string;
    condition?: string;
    [key: string]: any;
  };
  inputSchema?: Record<string, string>;
  outputSchema?: Record<string, string>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  lastRun?: string;
  successRate?: string;
  totalRuns?: number;
  updatedAt: string;
  category?: string;
}

export interface ExecutionStepLog {
  nodeId: string;
  nodeName: string;
  status: 'running' | 'success' | 'error';
  durationMs: number;
  timestamp: string;
  input?: any;
  output?: any;
  errorDetails?: string;
}

export interface ExecutionRecord {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'success' | 'failed' | 'running' | 'waiting';
  startedAt: string;
  durationMs: number;
  itemsProcessed: number;
  triggerType: string;
  logs: ExecutionStepLog[];
}

export interface AIAgentDefinition {
  id: string;
  name: string;
  description: string;
  avatar: string;
  model: string;
  tools: string[];
  status: 'active' | 'inactive';
  systemPrompt: string;
  runsCount: number;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  category: 'AI' | 'Communication' | 'Databases' | 'Productivity' | 'CRM' | 'Developer Tools';
  description: string;
  iconName: string;
  isConnected: boolean;
  authType: 'OAuth2' | 'API Key' | 'Basic Auth';
}
