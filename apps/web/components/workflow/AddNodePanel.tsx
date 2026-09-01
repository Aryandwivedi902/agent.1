'use client';

import React, { useState } from 'react';
import {
  X,
  Search,
  Webhook,
  Code,
  Bot,
  Database,
  GitFork,
  Send,
  Ticket,
  Zap,
  Globe,
  Mail,
  MessageSquare,
  Sparkles,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { NodeCategory, WorkflowNodeData } from '../../types/workflow';

interface NodeOption {
  typeId: string;
  label: string;
  category: NodeCategory;
  iconName: string;
  description: string;
  defaultConfig: Record<string, any>;
}

const nodeCatalog: NodeOption[] = [
  // Triggers
  { typeId: 'webhook', label: 'Webhook Trigger', category: 'trigger', iconName: 'Webhook', description: 'Triggers workflow on incoming HTTP POST payload', defaultConfig: { method: 'POST' } },
  { typeId: 'schedule', label: 'Schedule Trigger', category: 'trigger', iconName: 'Zap', description: 'Runs workflow at fixed intervals or cron schedules', defaultConfig: { cron: '0 9 * * *' } },
  { typeId: 'email-trigger', label: 'Email Trigger', category: 'trigger', iconName: 'Mail', description: 'Triggers when a new email matches criteria', defaultConfig: { mailbox: 'inbox@company.com' } },

  // AI
  { typeId: 'ai-agent', label: 'AI Agent', category: 'ai', iconName: 'Bot', description: 'Autonomously performs multi-step tasks using AI tools', defaultConfig: { model: 'GPT-4o (OpenAI)', temperature: 0.3 } },
  { typeId: 'llm', label: 'LLM Model', category: 'ai', iconName: 'Sparkles', description: 'Direct prompt execution with OpenAI, Claude, or Llama', defaultConfig: { model: 'Claude 3.5 Sonnet' } },
  { typeId: 'vector-db', label: 'Vector Database Search', category: 'ai', iconName: 'Database', description: 'Perform semantic search across company knowledge base', defaultConfig: { collection: 'docs-v1', topK: 5 } },
  { typeId: 'prompt-template', label: 'Prompt Template', category: 'ai', iconName: 'Code', description: 'Formats input variables into structured LLM prompts', defaultConfig: { template: 'User query: {{input}}' } },

  // Logic
  { typeId: 'if-else', label: 'If / Else Branch', category: 'logic', iconName: 'GitFork', description: 'Routes execution based on conditional expressions', defaultConfig: { condition: 'confidence >= 0.8' } },
  { typeId: 'transform', label: 'Extract & Transform', category: 'logic', iconName: 'Code', description: 'Modifies, filters, or formats JSON payload data', defaultConfig: { script: 'return data;' } },

  // Integrations
  { typeId: 'http-request', label: 'HTTP Request', category: 'integration', iconName: 'Globe', description: 'Makes REST API call to external web services', defaultConfig: { url: 'https://api.external.com/v1', method: 'GET' } },
  { typeId: 'slack', label: 'Slack Notification', category: 'integration', iconName: 'MessageSquare', description: 'Posts formatted markdown message to Slack channel', defaultConfig: { channel: '#alerts' } },
  { typeId: 'crm', label: 'CRM Ticket Creator', category: 'integration', iconName: 'Ticket', description: 'Creates or updates customer ticket in CRM', defaultConfig: { priority: 'High' } },

  // Output
  { typeId: 'send-message', label: 'Send Customer Reply', category: 'output', iconName: 'Send', description: 'Sends automated reply message or webhook response', defaultConfig: {} },
];

export const AddNodePanel: React.FC = () => {
  const { isAddNodePanelOpen, setIsAddNodePanelOpen, addNode } = useWorkflowStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isAddNodePanelOpen) return null;

  const categories: { label: string; value: string }[] = [
    { label: 'All', value: 'all' },
    { label: 'Triggers', value: 'trigger' },
    { label: 'AI', value: 'ai' },
    { label: 'Logic', value: 'logic' },
    { label: 'Integrations', value: 'integration' },
    { label: 'Outputs', value: 'output' },
  ];

  const filteredNodes = nodeCatalog.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectNode = (item: NodeOption) => {
    addNode({
      label: item.label,
      category: item.category,
      typeId: item.typeId,
      iconName: item.iconName,
      description: item.description,
      config: item.defaultConfig,
    });
    setIsAddNodePanelOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-100">Add Step to Workflow</h2>
          </div>
          <button
            onClick={() => setIsAddNodePanelOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes, apps and actions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  selectedCategory === cat.value
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Node Cards List */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3 custom-scrollbar">
          {filteredNodes.map((item) => (
            <div
              key={item.typeId}
              onClick={() => handleSelectNode(item)}
              className="group p-3.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-850 hover:border-indigo-500/50 transition-all cursor-pointer flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {item.label}
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-slate-800 text-slate-400 rounded uppercase">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
