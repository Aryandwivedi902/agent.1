'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, SlidersHorizontal, ArrowLeftRight, Settings2, Trash2, Copy, Save } from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const NodeConfigDrawer: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    setSelectedNodeId,
    isConfigPanelOpen,
    setIsConfigPanelOpen,
    updateNodeData,
    deleteNode,
    duplicateNode,
  } = useWorkflowStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const [activeTab, setActiveTab] = useState<'parameters' | 'input' | 'output' | 'settings'>('parameters');

  // Form state
  const [label, setLabel] = useState('');
  const [model, setModel] = useState('GPT-4o (OpenAI)');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userInput, setUserInput] = useState('{{ node-extract.message }}');
  const [temperature, setTemperature] = useState(0.3);
  const [memory, setMemory] = useState('Conversation Buffer Window (k=5)');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
      setModel(selectedNode.data.config?.model || 'GPT-4o (OpenAI)');
      setSystemPrompt(selectedNode.data.config?.systemPrompt || 'You are a helpful AI assistant.');
      setUserInput(selectedNode.data.config?.userInput || '{{ previousNode.message }}');
      setTemperature(selectedNode.data.config?.temperature ?? 0.3);
      setMemory(selectedNode.data.config?.memory || 'Conversation Buffer Window (k=5)');
    }
  }, [selectedNodeId, selectedNode]);

  if (!isConfigPanelOpen || !selectedNode) return null;

  const handleSave = () => {
    updateNodeData(selectedNode.id, {
      label,
      config: {
        ...selectedNode.data.config,
        model,
        systemPrompt,
        userInput,
        temperature,
        memory,
      },
    });
    setIsConfigPanelOpen(false);
  };

  return (
    <aside className="w-96 border-l border-slate-800 bg-slate-950 flex flex-col h-full z-20 shrink-0 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-slate-100 truncate">{selectedNode.data.label}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
              {selectedNode.data.category} node
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsConfigPanelOpen(false)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Tabs */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950 px-2 text-xs">
        {[
          { id: 'parameters', label: 'Parameters', icon: SlidersHorizontal },
          { id: 'input', label: 'Input', icon: ArrowLeftRight },
          { id: 'output', label: 'Output', icon: ArrowLeftRight },
          { id: 'settings', label: 'Settings', icon: Settings2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
        {activeTab === 'parameters' && (
          <>
            {/* Label input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Node Name
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-100 font-medium"
              />
            </div>

            {/* AI Model selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                AI Model Provider
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="GPT-4o (OpenAI)">GPT-4o (OpenAI)</option>
                <option value="Claude 3.5 Sonnet (Anthropic)">Claude 3.5 Sonnet (Anthropic)</option>
                <option value="DeepSeek Coder v2">DeepSeek Coder v2</option>
                <option value="Llama 3.1 70B (Groq)">Llama 3.1 70B (Groq)</option>
              </select>
            </div>

            {/* System Prompt */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                System Instructions Prompt
              </label>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-slate-100 font-mono text-[11px] leading-relaxed resize-none"
              />
            </div>

            {/* User Input Expression */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                User Input Mapping
              </label>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 font-mono text-indigo-300"
              />
            </div>

            {/* Temperature Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Temperature (Creativity)</span>
                <span className="font-mono text-indigo-400">{temperature}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Memory Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Agent Conversation Memory
              </label>
              <select
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-slate-100"
              >
                <option value="Conversation Buffer Window (k=5)">Conversation Buffer Window (k=5)</option>
                <option value="Vector Memory (Redis)">Vector Memory (Redis Store)</option>
                <option value="None">Stateless (No Memory)</option>
              </select>
            </div>
          </>
        )}

        {activeTab === 'input' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200">Incoming Input Payload Schema</h4>
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">
{JSON.stringify(
  {
    previousNodeId: 'node-extract',
    customer: { id: 'usr-9281', name: 'John Doe' },
    message: 'How do I reset my organization API key?',
    timestamp: '2026-09-02T01:10:00Z',
  },
  null,
  2
)}
            </pre>
          </div>
        )}

        {activeTab === 'output' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200">Output Response Payload Schema</h4>
            <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-sky-400 font-mono text-[11px] overflow-x-auto">
{JSON.stringify(
  {
    status: 'success',
    confidenceScore: 0.94,
    answer: 'To reset your API key, navigate to Settings > API Credentials and click Rotate Key.',
    suggestedAction: 'Send Reply',
  },
  null,
  2
)}
            </pre>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-200">Node Management</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateNode(selectedNode.id)}
                  icon={<Copy className="w-4 h-4" />}
                >
                  Duplicate
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteNode(selectedNode.id)}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Delete Step
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setIsConfigPanelOpen(false)}>
          Cancel
        </Button>
        <Button variant="primary" size="sm" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>
    </aside>
  );
};
