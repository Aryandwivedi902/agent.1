'use client';

import React, { useState } from 'react';
import { HRShell } from '../../components/layout/HRShell';
import { Card3D } from '../../components/ui/Card3D';
import { AgentAvatar3D } from '../../components/ui/AgentAvatar3D';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Play,
  Bot,
  Zap,
  Terminal,
  ChevronRight,
  Plus,
  History,
} from 'lucide-react';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';

export default function AIManagerWorkspacePage() {
  const {
    chatMessages,
    executionTimeline,
    isProcessingRequest,
    sendUserRequest,
    selectedModel,
    agents,
  } = useHRAIManagerStore();

  const [inputQuery, setInputQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isProcessingRequest) return;
    const text = inputQuery.trim();
    setInputQuery('');
    await sendUserRequest(text);
  };

  const presetQueries = [
    'Find strong candidates for the Backend Engineer position, rank them, prepare interview invitations, and ask me for approval before sending.',
    'Prepare onboarding for the five employees joining Monday.',
    'Explain our 2026 maternity leave and PTO rollover policy.',
  ];

  return (
    <HRShell>
      <div className="flex-1 flex flex-col lg:flex-row h-full min-h-0 overflow-hidden bg-slate-950">
        {/* Left Column: Conversation History & Presets */}
        <div className="w-full lg:w-72 border-r border-slate-800/80 bg-slate-950/80 flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Sessions</span>
            </div>
            <Button variant="ghost" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              New
            </Button>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-4 custom-scrollbar text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase px-2">Task Presets</span>
              {presetQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputQuery(q)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-850 hover:border-indigo-500/40 transition-colors text-slate-300 line-clamp-2 leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Main AI Manager Chat */}
        <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-950 border-r border-slate-800/80 relative">
          {/* Chat Header */}
          <div className="h-14 px-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">HR AI Manager (Orchestrator Desk)</h2>
                <span className="text-[10px] text-indigo-400 font-mono">Infrastructure Model: {selectedModel}</span>
              </div>
            </div>

            <Badge variant="purple">6 AGENTS CONNECTED</Badge>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 max-w-3xl ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {msg.sender === 'user' ? (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-md">
                    AD
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed space-y-3 shadow-lg ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Plan Decomposition Card */}
                  {msg.plan && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                        Decomposed Multi-Agent Plan ({msg.plan.length} Agents)
                      </span>
                      <div className="space-y-1.5">
                        {msg.plan.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px]"
                          >
                            <div className="flex items-center gap-2">
                              {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              {step.status === 'waiting_approval' && (
                                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              )}
                              <span className="font-bold text-slate-200">{step.agentName}</span>
                            </div>
                            <span className="text-slate-400 truncate max-w-[200px]">{step.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] opacity-60 block text-right font-mono">{msg.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800/80 bg-slate-950/90">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Give instructions to HR AI Manager (e.g. 'Prepare onboarding for Monday new hires')..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isProcessingRequest}
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-100 placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={isProcessingRequest || !inputQuery.trim()}
                className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Execution Timeline & Context */}
        <div className="w-full lg:w-96 border-l border-slate-800/80 bg-slate-950/80 flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live Execution Timeline</span>
            </div>
            <Badge variant="purple">{executionTimeline.length} Steps</Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {executionTimeline.map((step) => (
              <div
                key={step.id}
                className="relative pl-6 pb-4 border-l border-slate-800 last:border-l-0 last:pb-0 space-y-1.5"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-900 border-2 border-indigo-500" />

                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100">{step.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{step.timestamp}</span>
                </div>

                <p className="text-slate-400 leading-relaxed text-[11px]">{step.description}</p>

                {/* Metadata Chips */}
                {(step.toolUsed || step.durationMs) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {step.toolUsed && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-indigo-300 font-mono">
                        Tool: {step.toolUsed}
                      </span>
                    )}
                    {step.durationMs && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-emerald-400 font-mono">
                        {step.durationMs}ms
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRShell>
  );
}
