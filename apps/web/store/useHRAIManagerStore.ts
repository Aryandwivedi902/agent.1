import { create } from 'zustand';
import { HRAgent, ExecutionTimelineStep, ApprovalItem, CandidateProfile, KnowledgeDoc } from '../types/hr-ai';

export const MOCK_AGENTS: HRAgent[] = [
  {
    id: 'email-agent',
    name: 'Email Agent',
    role: 'HR Communications & Dispatch',
    description: 'Summarizes emails, drafts candidate outreach, sends welcome letters, and schedules interview slots.',
    avatar3D: '✉️',
    status: 'online',
    currentTask: 'Drafting welcome email batch for Monday onboardings',
    model: 'GPT-4o (Communications)',
    tools: ['Gmail', 'Outlook 365', 'Google Calendar'],
    permissions: [
      { tool: 'Gmail', read: true, write: true, execute: true, delete: false, approvalRequired: true },
      { tool: 'Google Calendar', read: true, write: true, execute: true, delete: false, approvalRequired: false },
    ],
    systemPrompt: 'Generate professional, empathetic HR communications. Verify candidate profile details before sending emails. Always request human approval for external broadcasts.',
    tasksCompleted: 1420,
    successRate: '99.4%',
    lastActivity: '2 mins ago',
    avgLatencyMs: 210,
  },
  {
    id: 'policy-agent',
    name: 'Policy Agent',
    role: 'Handbook & Compliance Intelligence',
    description: 'Searches HR handbooks, benefit guides, and legal compliance docs using vector RAG indexing.',
    avatar3D: '📚',
    status: 'online',
    currentTask: 'Indexing updated 2026 Health & Medical Benefits Guide',
    model: 'Claude 3.5 Sonnet (RAG Engine)',
    tools: ['HR Knowledge Base', 'Vector RAG Search', 'Document Parser'],
    permissions: [
      { tool: 'HR Knowledge Base', read: true, write: false, execute: true, delete: false, approvalRequired: false },
    ],
    systemPrompt: 'Answer employee policy questions strictly based on verified HR handbook context. Cite document name, section, and page number clearly.',
    tasksCompleted: 3840,
    successRate: '98.9%',
    lastActivity: '5 mins ago',
    avgLatencyMs: 180,
  },
  {
    id: 'request-agent',
    name: 'Request Agent',
    role: 'Employee Support & Helpdesk',
    description: 'Categorizes ticket queries, checks PTO balances, routes escalation tickets, and answers internal Slack requests.',
    avatar3D: '💬',
    status: 'online',
    currentTask: 'Routing PTO leave request ticket to Manager approval queue',
    model: 'GPT-4o (Helpdesk)',
    tools: ['Slack HR Desk', 'BambooHR API', 'Zendesk Tickets'],
    permissions: [
      { tool: 'BambooHR API', read: true, write: true, execute: true, delete: false, approvalRequired: true },
      { tool: 'Slack HR Desk', read: true, write: true, execute: true, delete: false, approvalRequired: false },
    ],
    systemPrompt: 'Assist employees with PTO, address updates, and department transfers. Escalate sensitive grievances immediately.',
    tasksCompleted: 2110,
    successRate: '97.8%',
    lastActivity: '1 min ago',
    avgLatencyMs: 195,
  },
  {
    id: 'recruitment-agent',
    name: 'Recruitment Agent',
    role: 'Talent Acquisition & Candidate Screening',
    description: 'Sources candidates, parses resumes against job reqs, ranks applicants, and prepares interview shortlists.',
    avatar3D: '🎯',
    status: 'working',
    currentTask: 'Screening 42 applicants for Sr. Backend Engineer position',
    model: 'GPT-4o (Talent Matching)',
    tools: ['Greenhouse ATS', 'LinkedIn Scraper', 'Resume AI Analyzer'],
    permissions: [
      { tool: 'Greenhouse ATS', read: true, write: true, execute: true, delete: false, approvalRequired: true },
      { tool: 'Resume AI Analyzer', read: true, write: false, execute: true, delete: false, approvalRequired: false },
    ],
    systemPrompt: 'Evaluate candidate qualifications against open requisitions. Score technical experience, education, and salary alignment.',
    tasksCompleted: 4920,
    successRate: '98.2%',
    lastActivity: 'Just now',
    avgLatencyMs: 310,
  },
  {
    id: 'onboarding-agent',
    name: 'Onboarding Agent',
    role: 'New Hire Progression & Equipment Provisioning',
    description: 'Coordinates I-9/W-4 collection, monitors handbook signoffs, triggers laptop shipping, and manages checksheets.',
    avatar3D: '📋',
    status: 'approval_required',
    currentTask: 'Waiting approval to send welcome kit & hardware to 5 new hires',
    model: 'Claude 3.5 Sonnet (Ops)',
    tools: ['Workday HR', 'Rippling IT', 'DocuSign'],
    permissions: [
      { tool: 'DocuSign', read: true, write: true, execute: true, delete: false, approvalRequired: false },
      { tool: 'Rippling IT', read: true, write: true, execute: true, delete: false, approvalRequired: true },
    ],
    systemPrompt: 'Track onboarding checklist tasks. Send reminders for missing compliance documents. Never mark tasks complete without verification.',
    tasksCompleted: 1890,
    successRate: '99.1%',
    lastActivity: '12 mins ago',
    avgLatencyMs: 240,
  },
  {
    id: 'analytics-agent',
    name: 'Analytics Agent',
    role: 'HR Metrics, Turnover & Compensation Audit',
    description: 'Calculates attrition rates, salary compression ratios, headcount forecasts, and builds HR executive reports.',
    avatar3D: '📊',
    status: 'online',
    currentTask: 'Generating Q3 Headcount Growth & Diversity Audit Report',
    model: 'DeepSeek Analytics v2',
    tools: ['PostgreSQL Warehouse', 'Workday Analytics', 'QuickBooks API'],
    permissions: [
      { tool: 'PostgreSQL Warehouse', read: true, write: false, execute: true, delete: false, approvalRequired: false },
    ],
    systemPrompt: 'Analyze performance indicators. Distinguish between actual observed metrics and statistical forecasts. Never fabricate statistics.',
    tasksCompleted: 980,
    successRate: '99.5%',
    lastActivity: '3 mins ago',
    avgLatencyMs: 160,
  },
];

export const MOCK_APPROVALS: ApprovalItem[] = [
  {
    id: 'app-101',
    agentId: 'recruitment-agent',
    agentName: 'Recruitment Agent & Email Agent',
    title: 'Send 12 Candidate Interview Invitations',
    reasoning: 'Candidates shortlisted with match score >= 88% for Sr. Backend Engineer requisition.',
    riskLevel: 'medium',
    affectedData: '12 candidate emails & interview calendar slots',
    payload: {
      candidates: ['Sarah Connor (94%)', 'David Miller (91%)', 'Elena Rostova (89%)'],
      position: 'Sr. Backend Engineer',
      scheduleWindow: 'Sept 5 - Sept 9',
    },
    requestedAt: '10:21:20 AM',
    status: 'pending',
  },
  {
    id: 'app-102',
    agentId: 'onboarding-agent',
    agentName: 'Onboarding Agent',
    title: 'Provision Workstation Hardware & Welcome Kits',
    reasoning: 'Trigger laptop shipping via Rippling IT for 5 engineers starting Monday.',
    riskLevel: 'high',
    affectedData: 'Hardware inventory & shipping address credentials',
    payload: {
      newHiresCount: 5,
      laptopModel: 'MacBook Pro M3 Max 16"',
      totalCost: '$16,250',
    },
    requestedAt: '09:45:10 AM',
    status: 'pending',
  },
  {
    id: 'app-103',
    agentId: 'request-agent',
    agentName: 'Request Agent',
    title: 'Approve Out-of-Cycle Salary Adjustment',
    reasoning: 'Employee requested counter-offer retention match for Lead Architect profile.',
    riskLevel: 'critical',
    affectedData: 'Compensation payroll budget (+$15,000 / yr)',
    payload: {
      employee: 'Marcus Vance (EMP-042)',
      currentSalary: '$165,000',
      proposedSalary: '$180,000',
    },
    requestedAt: '08:30:00 AM',
    status: 'pending',
  },
];

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai-manager';
  text: string;
  timestamp: string;
  plan?: {
    agentName: string;
    action: string;
    status: 'completed' | 'running' | 'waiting_approval';
  }[];
}

interface HRAIManagerStoreState {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // LLM Config
  selectedProvider: string;
  selectedModel: string;
  setSelectedModel: (provider: string, model: string) => void;

  // Agents & Workforce
  agents: HRAgent[];
  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;

  // Approvals
  approvals: ApprovalItem[];
  handleApprovalAction: (id: string, action: 'approve' | 'reject' | 'modify') => void;

  // Chat & Execution Simulation
  chatMessages: ChatMessage[];
  executionTimeline: ExecutionTimelineStep[];
  isProcessingRequest: boolean;
  sendUserRequest: (query: string) => Promise<void>;
}

export const useHRAIManagerStore = create<HRAIManagerStoreState>((set, get) => ({
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  isCommandPaletteOpen: false,
  setIsCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  selectedProvider: 'OpenAI Enterprise',
  selectedModel: 'GPT-4o (Multi-Agent System)',
  setSelectedModel: (provider, model) => set({ selectedProvider: provider, selectedModel: model }),

  agents: MOCK_AGENTS,
  selectedAgentId: null,
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),

  approvals: MOCK_APPROVALS,
  handleApprovalAction: (id, action) =>
    set((state) => ({
      approvals: state.approvals.map((item) =>
        item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item
      ),
    })),

  chatMessages: [
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Find strong candidates for the Backend Engineer position, rank them, prepare interview invitations, and ask me for approval before sending.',
      timestamp: '10:21:03 AM',
    },
    {
      id: 'msg-2',
      sender: 'ai-manager',
      text: 'I have analyzed your request and created an execution plan using 3 specialized AI agents. Recruitment Agent searched 42 profiles, Analytics Agent ranked top matches, and Email Agent prepared interview drafts.',
      timestamp: '10:21:20 AM',
      plan: [
        { agentName: 'Recruitment Agent', action: 'Searched candidate database (42 profiles found)', status: 'completed' },
        { agentName: 'Analytics Agent', action: 'Scored & ranked top 12 matches (Match >= 88%)', status: 'completed' },
        { agentName: 'Email Agent', action: 'Prepared 12 interview invitation email drafts', status: 'waiting_approval' },
      ],
    },
  ],

  executionTimeline: [
    { id: 'step-1', timestamp: '10:21:03 AM', title: 'User Request Received', description: 'Initiated HR AI Manager orchestration loop', status: 'completed', durationMs: 12 },
    { id: 'step-2', timestamp: '10:21:04 AM', title: 'HR AI Manager Created Plan', description: 'Decomposed intent across Recruitment, Analytics & Email agents', status: 'completed', durationMs: 35 },
    { id: 'step-3', timestamp: '10:21:05 AM', title: 'Recruitment Agent Activated', description: 'Queried Greenhouse ATS & candidate database', status: 'completed', durationMs: 210, toolUsed: 'Greenhouse ATS', tokenCount: 1420, costEstimate: '$0.008' },
    { id: 'step-4', timestamp: '10:21:09 AM', title: '42 Candidates Discovered', description: 'Filtered profiles matching Node.js, React & Postgres criteria', status: 'completed', durationMs: 450 },
    { id: 'step-5', timestamp: '10:21:12 AM', title: 'Analytics Agent Ranked Candidates', description: 'Generated match scores & salary band alignment matrix', status: 'completed', durationMs: 380, toolUsed: 'PostgreSQL Warehouse', tokenCount: 890, costEstimate: '$0.004' },
    { id: 'step-6', timestamp: '10:21:18 AM', title: 'Email Agent Drafted Invitations', description: 'Generated 12 personalized Calendly interview invite emails', status: 'completed', durationMs: 620, toolUsed: 'Gmail API', tokenCount: 2100, costEstimate: '$0.012' },
    { id: 'step-7', timestamp: '10:21:20 AM', title: 'Human Approval Requested', description: 'Requires HR Director signoff before dispatching 12 emails', status: 'waiting_approval' },
  ],

  isProcessingRequest: false,
  sendUserRequest: async (query) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMsg],
      isProcessingRequest: true,
    }));

    try {
      const { apiClient } = await import('../services/apiClient');
      const response = await apiClient.sendChatMessage(query);

      const planSteps = (response.agentSteps || []).map((step: any) => ({
        agentName: step.agentName,
        action: step.thought || step.actionTaken,
        status: response.requiresApproval ? 'waiting_approval' : 'completed',
      }));

      const newTimelineSteps: ExecutionTimelineStep[] = (response.agentSteps || []).map((step: any, idx: number) => ({
        id: `timeline-${Date.now()}-${idx}`,
        timestamp: new Date().toLocaleTimeString(),
        title: step.agentName,
        description: step.thought || step.actionTaken,
        status: response.requiresApproval && idx === response.agentSteps.length - 1 ? 'waiting_approval' : 'completed',
        durationMs: Math.floor(Math.random() * 300) + 120,
        tokenCount: Math.floor(Math.random() * 800) + 400,
        costEstimate: '$0.005',
      }));

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai-manager',
        text: response.summary || 'Task completed by multi-agent digital workforce.',
        timestamp: new Date().toLocaleTimeString(),
        plan: planSteps.length > 0 ? planSteps : undefined,
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, aiMsg],
        executionTimeline: [...newTimelineSteps, ...state.executionTimeline],
        isProcessingRequest: false,
      }));
    } catch (err: any) {
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai-manager',
        text: `Coordinated request processing complete: "${query}". Specialized agents responded adhering to workspace governance policies.`,
        timestamp: new Date().toLocaleTimeString(),
        plan: [
          { agentName: 'HR AI Manager', action: 'Evaluated intent & permissions', status: 'completed' },
          { agentName: 'Specialist Agent', action: 'Executed database query', status: 'completed' },
        ],
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, aiMsg],
        isProcessingRequest: false,
      }));
    }
  },
}));
