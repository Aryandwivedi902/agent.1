'use client';

import React, { useState } from 'react';
import { HRShell } from '../../components/layout/HRShell';
import { Card3D } from '../../components/ui/Card3D';
import { AgentAvatar3D } from '../../components/ui/AgentAvatar3D';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Bot,
  Plus,
  Settings,
  Play,
  SlidersHorizontal,
  Key,
  ShieldCheck,
  BookOpen,
  FileCode,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';
import { HRAgent } from '../../types/hr-ai';

export default function AgentsPage() {
  const { agents, setSelectedAgentId } = useHRAIManagerStore();
  const [activeAgentModal, setActiveAgentModal] = useState<HRAgent | null>(null);
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'instructions' | 'tools' | 'permissions'>('instructions');

  // Instructions Prompt Editor State
  const [testPromptInput, setTestPromptInput] = useState('Explain our annual leave & PTO rollover policy.');
  const [testOutputResult, setTestOutputResult] = useState<string | null>(null);

  const handleTestAgent = () => {
    setTestOutputResult(
      'Full-time employees accrue PTO at 1.25 days per month (15 days annually). A maximum of 5 unused days may roll over into the subsequent fiscal year.'
    );
  };

  return (
    <HRShell>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <span>Your Digital AI Workforce</span>
              <Badge variant="purple">6 SPECIALIZED AGENTS</Badge>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage, configure, and monitor specialized AI employees under the central HR AI Manager
            </p>
          </div>

          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Create Agent
          </Button>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card3D key={agent.id} glowColor="indigo" className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <AgentAvatar3D emoji={agent.avatar3D} size="lg" status={agent.status} />
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-base font-bold text-slate-100 truncate">{agent.name}</h3>
                      <span className="text-[11px] text-indigo-400 font-mono">{agent.role}</span>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'working' ? 'purple' : 'success'}>
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{agent.description}</p>

                {/* Current Task */}
                {agent.currentTask && (
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[9px]">
                      Current Task
                    </span>
                    <span className="line-clamp-1">{agent.currentTask}</span>
                  </div>
                )}

                {/* Tools Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Tools ({agent.tools.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {agent.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">{agent.tasksCompleted} tasks ({agent.successRate})</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveAgentModal(agent);
                    setSelectedAgentId(agent.id);
                  }}
                  icon={<Settings className="w-3.5 h-3.5" />}
                >
                  Configure
                </Button>
              </div>
            </Card3D>
          ))}
        </div>

        {/* Advanced Agent Configuration Modal / Drawer */}
        {activeAgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AgentAvatar3D emoji={activeAgentModal.avatar3D} size="md" status={activeAgentModal.status} />
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">{activeAgentModal.name} Intelligence Inspector</h2>
                    <span className="text-xs font-mono text-indigo-400">Model: {activeAgentModal.model}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAgentModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs Header */}
              <div className="flex items-center border-b border-slate-800 bg-slate-950 px-4 text-xs">
                {[
                  { id: 'instructions', label: 'Instructions Prompt Editor', icon: FileCode },
                  { id: 'permissions', label: 'Permission Matrix', icon: ShieldCheck },
                  { id: 'tools', label: 'Tools Marketplace', icon: Key },
                  { id: 'overview', label: 'Architecture Overview', icon: SlidersHorizontal },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setInspectorTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors ${
                      inspectorTab === tab.id
                        ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-xs">
                {inspectorTab === 'instructions' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                        System Instructions & Behavior Rules
                      </label>
                      <textarea
                        rows={6}
                        defaultValue={activeAgentModal.systemPrompt}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-100 font-mono leading-relaxed"
                      />
                    </div>

                    {/* Test Agent Box */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
                          Test Agent Instruction Execution
                        </span>
                        <Button variant="primary" size="sm" onClick={handleTestAgent} icon={<Play className="w-3.5 h-3.5" />}>
                          Test Agent
                        </Button>
                      </div>

                      <input
                        type="text"
                        value={testPromptInput}
                        onChange={(e) => setTestPromptInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono"
                      />

                      {testOutputResult && (
                        <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-lg text-emerald-300 font-mono">
                          {testOutputResult}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {inspectorTab === 'permissions' && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-200">Tool Permission Matrix</h4>
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                          <th className="pb-2">Tool Name</th>
                          <th className="pb-2">Read</th>
                          <th className="pb-2">Write</th>
                          <th className="pb-2">Execute</th>
                          <th className="pb-2">Delete</th>
                          <th className="pb-2">Human Approval</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {activeAgentModal.permissions.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 font-bold text-slate-200 font-sans">{p.tool}</td>
                            <td className="py-2.5 text-emerald-400">{p.read ? '✓' : '—'}</td>
                            <td className="py-2.5 text-emerald-400">{p.write ? '✓' : '—'}</td>
                            <td className="py-2.5 text-emerald-400">{p.execute ? '✓' : '—'}</td>
                            <td className="py-2.5 text-rose-400">{p.delete ? '✓' : '—'}</td>
                            <td className="py-2.5">
                              <Badge variant={p.approvalRequired ? 'warning' : 'default'}>
                                {p.approvalRequired ? 'Required' : 'Optional'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {inspectorTab === 'tools' && (
                  <div className="grid grid-cols-2 gap-3">
                    {activeAgentModal.tools.map((tool, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="font-bold text-slate-200">{tool}</span>
                        <Badge variant="success">Connected ✓</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </HRShell>
  );
}
