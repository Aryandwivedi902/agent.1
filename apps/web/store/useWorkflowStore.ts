import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from '@xyflow/react';
import { WorkflowNodeData, ExecutionStepLog, NodeExecutionStatus } from '../types/workflow';

// Initial default example workflow
export const INITIAL_NODES: Node<WorkflowNodeData>[] = [
  {
    id: 'node-webhook',
    type: 'customNode',
    position: { x: 100, y: 200 },
    data: {
      label: 'Webhook Trigger',
      category: 'trigger',
      typeId: 'webhook',
      iconName: 'Webhook',
      description: 'Receives incoming HTTP payload from customer webhooks',
      status: 'idle',
      config: {
        method: 'POST',
        webhookUrl: 'https://api.flowforge.ai/v1/webhooks/inbound-support',
      },
    },
  },
  {
    id: 'node-extract',
    type: 'customNode',
    position: { x: 420, y: 200 },
    data: {
      label: 'Extract User Message',
      category: 'logic',
      typeId: 'transform',
      iconName: 'Code',
      description: 'Parses JSON payload to isolate user body & metadata',
      status: 'idle',
      config: {
        condition: 'payload.message !== undefined',
      },
    },
  },
  {
    id: 'node-ai-agent',
    type: 'customNode',
    position: { x: 740, y: 200 },
    data: {
      label: 'AI Support Agent',
      category: 'ai',
      typeId: 'ai-agent',
      iconName: 'Bot',
      description: 'Evaluates intent and retrieves candidate responses',
      status: 'idle',
      config: {
        model: 'GPT-4o (OpenAI)',
        systemPrompt: 'You are an expert customer support agent. Analyze intent, search knowledge base, and answer politely.',
        userInput: '{{ node-extract.message }}',
        temperature: 0.3,
        tools: ['Knowledge Base', 'CRM Lookup'],
        memory: 'Conversation Buffer Window (k=5)',
      },
    },
  },
  {
    id: 'node-knowledge',
    type: 'customNode',
    position: { x: 1060, y: 200 },
    data: {
      label: 'Knowledge Base Search',
      category: 'ai',
      typeId: 'vector-db',
      iconName: 'Database',
      description: 'Queries vector store for matching product docs',
      status: 'idle',
      config: {
        collection: 'support-docs-v2',
        topK: 5,
      },
    },
  },
  {
    id: 'node-decision',
    type: 'customNode',
    position: { x: 1380, y: 200 },
    data: {
      label: 'Confidence Decision',
      category: 'logic',
      typeId: 'if-else',
      iconName: 'GitFork',
      description: 'Branches based on AI answer confidence score',
      status: 'idle',
      config: {
        condition: 'confidenceScore >= 0.85',
      },
    },
  },
  {
    id: 'node-reply',
    type: 'customNode',
    position: { x: 1720, y: 100 },
    data: {
      label: 'Send Customer Reply',
      category: 'output',
      typeId: 'send-message',
      iconName: 'Send',
      description: 'Sends automated response email/chat reply',
      status: 'idle',
      config: {
        channel: 'Email / Web Chat',
      },
    },
  },
  {
    id: 'node-ticket',
    type: 'customNode',
    position: { x: 1720, y: 320 },
    data: {
      label: 'Create Support Ticket',
      category: 'integration',
      typeId: 'crm',
      iconName: 'Ticket',
      description: 'Escalates query to Zendesk/CRM human queue',
      status: 'idle',
      config: {
        priority: 'High',
        assignee: 'Tier-2 Support',
      },
    },
  },
];

export const INITIAL_EDGES: Edge[] = [
  { id: 'e1-2', source: 'node-webhook', target: 'node-extract', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e2-3', source: 'node-extract', target: 'node-ai-agent', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e3-4', source: 'node-ai-agent', target: 'node-knowledge', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e4-5', source: 'node-knowledge', target: 'node-decision', animated: true, style: { strokeWidth: 2, stroke: '#6366f1' } },
  { id: 'e5-6', source: 'node-decision', target: 'node-reply', label: 'High Confidence', animated: true, style: { strokeWidth: 2, stroke: '#10b981' } },
  { id: 'e5-7', source: 'node-decision', target: 'node-ticket', label: 'Escalate', animated: true, style: { strokeWidth: 2, stroke: '#f59e0b' } },
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
  workflowId: 'wf-customer-support-01',
  workflowName: 'Customer Support AI Agent',
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

  // Undo / Redo (simple reset/history mock)
  undo: () => set({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }),
  redo: () => set({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }),

  // Execution Simulation
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
      { id: 'node-webhook', name: 'Webhook Trigger', duration: 24 },
      { id: 'node-extract', name: 'Extract User Message', duration: 38 },
      { id: 'node-ai-agent', name: 'AI Support Agent', duration: 1240 },
      { id: 'node-knowledge', name: 'Knowledge Base Search', duration: 420 },
      { id: 'node-decision', name: 'Confidence Decision', duration: 18 },
      { id: 'node-reply', name: 'Send Customer Reply', duration: 110 },
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
        input: { trigger: 'HTTP POST /inbound-support', body: { customerId: 'usr-9281', query: 'How to reset API key?' } },
        output: { result: 'Success', confidenceScore: 0.94, replySent: true },
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
