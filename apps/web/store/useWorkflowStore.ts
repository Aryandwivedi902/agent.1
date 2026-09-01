import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { WorkflowNodeData, ExecutionStepLog, NodeExecutionStatus } from '../types/workflow';

// Default HR Workflow: Automated Employee Onboarding & Resume Screening
export const INITIAL_NODES: Node<WorkflowNodeData>[] = [
  {
    id: 'node-hr-webhook',
    type: 'customNode',
    position: { x: 80, y: 220 },
    data: {
      label: 'Job Application Webhook',
      category: 'trigger',
      typeId: 'webhook',
      iconName: 'Webhook',
      description: 'Receives new candidate resumes from Greenhouse/Workday',
      status: 'idle',
      config: {
        method: 'POST',
        webhookUrl: 'https://api.hrflow.ai/v1/webhooks/talent-inbound',
      },
    },
  },
  {
    id: 'node-extract-resume',
    type: 'customNode',
    position: { x: 400, y: 220 },
    data: {
      label: 'Extract Candidate Profile',
      category: 'logic',
      typeId: 'transform',
      iconName: 'Code',
      description: 'Parses PDF resume to extract skills, experience & contact details',
      status: 'idle',
      config: {
        condition: 'resume.skills.length > 0',
      },
    },
  },
  {
    id: 'node-recruitment-agent',
    type: 'customNode',
    position: { x: 720, y: 220 },
    data: {
      label: 'Recruitment AI Agent',
      category: 'ai',
      typeId: 'ai-agent',
      iconName: 'Bot',
      description: 'Evaluates applicant suitability against target job description',
      status: 'idle',
      config: {
        model: 'GPT-4o (HR Specialized)',
        systemPrompt: 'Evaluate candidate qualifications against Sr. Software Engineer role. Check Node.js, React, and Python experience.',
        userInput: '{{ node-extract-resume.profile }}',
        temperature: 0.2,
        tools: ['HR Knowledge Base', 'Workday API', 'Greenhouse ATS'],
        memory: 'Candidate Profile Memory Buffer',
      },
    },
  },
  {
    id: 'node-hr-policy-search',
    type: 'customNode',
    position: { x: 1040, y: 220 },
    data: {
      label: 'HR Policy & Band Matcher',
      category: 'ai',
      typeId: 'vector-db',
      iconName: 'Database',
      description: 'Verifies salary band expectations against company compensation bands',
      status: 'idle',
      config: {
        collection: 'hr-salary-bands-2026',
        topK: 3,
      },
    },
  },
  {
    id: 'node-hr-decision',
    type: 'customNode',
    position: { x: 1360, y: 220 },
    data: {
      label: 'Qualification Check',
      category: 'logic',
      typeId: 'if-else',
      iconName: 'GitFork',
      description: 'Branches based on AI match score (threshold >= 85%)',
      status: 'idle',
      config: {
        condition: 'matchScore >= 85 && salaryExpectation <= bandMax',
      },
    },
  },
  {
    id: 'node-send-interview',
    type: 'customNode',
    position: { x: 1700, y: 120 },
    data: {
      label: 'Schedule Interview Email',
      category: 'output',
      typeId: 'send-message',
      iconName: 'Send',
      description: 'Sends Calendly booking invite link to qualified candidate',
      status: 'idle',
      config: {
        channel: 'Email (SendGrid)',
      },
    },
  },
  {
    id: 'node-create-hr-ticket',
    type: 'customNode',
    position: { x: 1700, y: 340 },
    data: {
      label: 'Escalate to HR Recruiter',
      category: 'integration',
      typeId: 'crm',
      iconName: 'Ticket',
      description: 'Routes candidate application to human HR recruiter queue for manual review',
      status: 'idle',
      config: {
        priority: 'Medium',
        assignee: 'Talent Acquisition Team',
      },
    },
  },
];

export const INITIAL_EDGES: Edge[] = [
  { id: 'e1-2', source: 'node-hr-webhook', target: 'node-extract-resume', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e2-3', source: 'node-extract-resume', target: 'node-recruitment-agent', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e3-4', source: 'node-recruitment-agent', target: 'node-hr-policy-search', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e4-5', source: 'node-hr-policy-search', target: 'node-hr-decision', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e5-6', source: 'node-hr-decision', target: 'node-send-interview', label: 'Match Score >= 85%', animated: true, style: { strokeWidth: 2, stroke: '#10b981' } },
  { id: 'e5-7', source: 'node-hr-decision', target: 'node-create-hr-ticket', label: 'Manual Review', animated: true, style: { strokeWidth: 2, stroke: '#f59e0b' } },
];

interface WorkflowStoreState {
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Workflow metadata
  workflowId: string;
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowStatus: 'draft' | 'published';
  setWorkflowStatus: (status: 'draft' | 'published') => void;
  isSaving: boolean;
  isSaved: boolean;
  saveWorkflow: () => Promise<void>;

  // Canvas Node & Edge state
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Selection & UI Panels
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  isConfigPanelOpen: boolean;
  setIsConfigPanelOpen: (open: boolean) => void;
  isAddNodePanelOpen: boolean;
  setIsAddNodePanelOpen: (open: boolean) => void;
  isExecutionPanelOpen: boolean;
  setIsExecutionPanelOpen: (open: boolean) => void;

  // Node operations
  addNode: (nodeData: Omit<WorkflowNodeData, 'status'>) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;

  // Undo / Redo
  undo: () => void;
  redo: () => void;

  // Execution Simulation
  isExecuting: boolean;
  executionStatus: NodeExecutionStatus;
  executionLogs: ExecutionStepLog[];
  runExecutionSimulation: () => void;
  clearExecutionLogs: () => void;
}

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  // Theme
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  // Metadata
  workflowId: 'wf-hr-recruitment-01',
  workflowName: 'Candidate Resume Screening & Onboarding Agent',
  setWorkflowName: (name) => set({ workflowName: name, isSaved: false }),
  workflowStatus: 'published',
  setWorkflowStatus: (status) => set({ workflowStatus: status }),
  isSaving: false,
  isSaved: true,
  saveWorkflow: async () => {
    set({ isSaving: true });
    await new Promise((r) => setTimeout(r, 600));
    set({ isSaving: false, isSaved: true });
  },

  // Canvas
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as Node<WorkflowNodeData>[],
    })),
  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),
  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge({ ...connection, animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } }, state.edges),
    })),

  // UI Panels
  selectedNodeId: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id, isConfigPanelOpen: !!id }),
  isConfigPanelOpen: false,
  setIsConfigPanelOpen: (open) => set({ isConfigPanelOpen: open }),
  isAddNodePanelOpen: false,
  setIsAddNodePanelOpen: (open) => set({ isAddNodePanelOpen: open }),
  isExecutionPanelOpen: false,
  setIsExecutionPanelOpen: (open) => set({ isExecutionPanelOpen: open }),

  // Node CRUD operations
  addNode: (nodeData) => {
    const id = `node-${Date.now()}`;
    const newNode: Node<WorkflowNodeData> = {
      id,
      type: 'customNode',
      position: { x: 500 + Math.random() * 100, y: 250 + Math.random() * 100 },
      data: {
        ...nodeData,
        status: 'idle',
      } as WorkflowNodeData,
    };
    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: id,
      isConfigPanelOpen: true,
      isSaved: false,
    }));
  },
  updateNodeData: (nodeId, partialData) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...partialData } as WorkflowNodeData } : node
      ),
      isSaved: false,
    }));
  },
  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      isConfigPanelOpen: state.selectedNodeId === nodeId ? false : state.isConfigPanelOpen,
      isSaved: false,
    }));
  },
  duplicateNode: (nodeId) => {
    const target = get().nodes.find((n) => n.id === nodeId);
    if (!target) return;
    const newId = `node-${Date.now()}`;
    const duplicatedNode: Node<WorkflowNodeData> = {
      ...target,
      id: newId,
      position: { x: target.position.x + 40, y: target.position.y + 40 },
      data: { ...target.data, label: `${target.data.label} (Copy)` } as WorkflowNodeData,
    };
    set((state) => ({
      nodes: [...state.nodes, duplicatedNode],
      selectedNodeId: newId,
      isSaved: false,
    }));
  },

  // Undo / Redo
  undo: () => set({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }),
  redo: () => set({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }),

  // HR Execution Simulation
  isExecuting: false,
  executionStatus: 'idle',
  executionLogs: [],
  clearExecutionLogs: () => set({ executionLogs: [] }),
  runExecutionSimulation: async () => {
    const { nodes } = get();
    set({
      isExecuting: true,
      executionStatus: 'running',
      isExecutionPanelOpen: true,
      executionLogs: [],
    });

    // Reset node statuses
    set((state) => ({
      nodes: state.nodes.map((n) => ({ ...n, data: { ...n.data, status: 'idle' as NodeExecutionStatus } as WorkflowNodeData })),
    }));

    const executionSteps = [
      { id: 'node-hr-webhook', name: 'Job Application Webhook', duration: 32 },
      { id: 'node-extract-resume', name: 'Extract Candidate Profile', duration: 45 },
      { id: 'node-recruitment-agent', name: 'Recruitment AI Agent', duration: 1150 },
      { id: 'node-hr-policy-search', name: 'HR Policy & Band Matcher', duration: 380 },
      { id: 'node-hr-decision', name: 'Qualification Check', duration: 15 },
      { id: 'node-send-interview', name: 'Schedule Interview Email', duration: 140 },
    ];

    for (const step of executionSteps) {
      // Set active running node
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === step.id ? { ...n, data: { ...n.data, status: 'running' as NodeExecutionStatus } as WorkflowNodeData } : n
        ),
      }));

      await new Promise((r) => setTimeout(r, Math.min(step.duration, 600)));

      const stepLog: ExecutionStepLog = {
        nodeId: step.id,
        nodeName: step.name,
        status: 'success',
        durationMs: step.duration,
        timestamp: new Date().toLocaleTimeString(),
        input: { trigger: 'Greenhouse Webhook', candidate: { name: 'Sarah Connor', position: 'Sr. Software Engineer' } },
        output: { result: 'Qualified', matchScore: 92, interviewLinkSent: true },
      };

      // Set node success
      set((state) => ({
        nodes: state.nodes.map((n) =>
          n.id === step.id ? { ...n, data: { ...n.data, status: 'success' as NodeExecutionStatus, executionTimeMs: step.duration } as WorkflowNodeData } : n
        ),
        executionLogs: [...state.executionLogs, stepLog],
      }));
    }

    set({ isExecuting: false, executionStatus: 'success' });
  },
}));
