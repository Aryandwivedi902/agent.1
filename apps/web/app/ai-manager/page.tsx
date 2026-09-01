'use client';

import React from 'react';
import Link from 'next/link';
import { AppLayout } from '../../components/layout/AppLayout';
import { Bot, Plus, Play, Settings, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockAgents } from '../../services/agentService';

export default function AIAgentsPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">AI Agents Hub</h1>
            <p className="text-sm text-slate-400">Autonomous AI specialists configured for domain tasks</p>
          </div>

          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Create AI Agent
          </Button>
        </div>

        {/* AI Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAgents.map((agent) => (
            <div
              key={agent.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 transition-all shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-2xl flex items-center justify-center shrink-0">
                      {agent.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{agent.name}</h3>
                      <span className="text-xs font-mono text-indigo-400">Model: {agent.model}</span>
                    </div>
                  </div>
                  <Badge variant={agent.status === 'active' ? 'success' : 'default'}>
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{agent.description}</p>

                {/* Connected Tools Tags */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Connected AI Tools ({agent.tools.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-950 text-slate-300 border border-slate-800 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">{agent.runsCount.toLocaleString()} total runs</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" icon={<Settings className="w-3.5 h-3.5" />}>
                    Settings
                  </Button>
                  <Link href="/">
                    <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5 fill-current" />}>
                      Open Agent Workflow
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
