export type AgentStatus = 'online' | 'working' | 'waiting' | 'approval_required' | 'completed' | 'failed' | 'offline';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface HRAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar3D: string;
  status: AgentStatus;
  currentTask?: string;
  model: string;
  tools: string[];
  permissions: {
    tool: string;
    read: boolean;
    write: boolean;
    execute: boolean;
    delete: boolean;
    approvalRequired: boolean;
  }[];
  systemPrompt: string;
  tasksCompleted: number;
  successRate: string;
  lastActivity: string;
  avgLatencyMs: number;
}

export interface ExecutionTimelineStep {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  agentId?: string;
  agentName?: string;
  status: 'queued' | 'running' | 'waiting_approval' | 'completed' | 'failed';
  toolUsed?: string;
  durationMs?: number;
  inputPayload?: any;
  outputPayload?: any;
  tokenCount?: number;
  costEstimate?: string;
  errorDetails?: string;
}

export interface ApprovalItem {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  reasoning: string;
  riskLevel: RiskLevel;
  affectedData: string;
  payload: any;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
}

export interface CandidateProfile {
  id: string;
  name: string;
  appliedRole: string;
  aiMatchScore: number;
  stage: 'Sourced' | 'Screened' | 'Shortlisted' | 'Interviewing' | 'Offered' | 'Hired' | 'Rejected';
  experienceYears: number;
  skills: string[];
  summary: string;
  appliedDate: string;
  email: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  sizeBytes: number;
  status: 'indexed' | 'processing' | 'failed';
  category: 'Policy' | 'Benefits' | 'Handbook' | 'Compliance' | 'Payroll';
  lastUpdated: string;
  chunksCount: number;
}
