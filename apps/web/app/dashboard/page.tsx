'use client';

import React from 'react';
import Link from 'next/link';
import { HRShell } from '../../components/layout/HRShell';
import { Card3D } from '../../components/ui/Card3D';
import { AgentAvatar3D } from '../../components/ui/AgentAvatar3D';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  Bot,
  Play,
  ArrowRight,
} from 'lucide-react';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';

export default function DashboardPage() {
  const { agents, approvals } = useHRAIManagerStore();
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  const topMetrics = [
    { label: 'Tasks Today', value: '148', change: '↑ 18.4% vs avg', icon: Activity, color: 'text-indigo-400' },
    { label: 'Active Agents', value: '6', change: '100% operational', icon: Bot, color: 'text-emerald-400' },
    { label: 'Pending Approvals', value: '3', change: 'Needs Human Signoff', icon: ShieldAlert, color: 'text-amber-400' },
    { label: 'Completed Automations', value: '2,840', change: '99.2% success rate', icon: CheckCircle2, color: 'text-sky-400' },
    { label: 'Hours Saved', value: '428 hrs', change: '63% administrative reduction', icon: Zap, color: 'text-purple-400' },
  ];

  return (
    <HRShell>
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Top Welcome Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
              <span>Agent Command Center</span>
              <Badge variant="purple">LIVE TELEMETRY</Badge>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              One HR AI Manager coordinating 6 specialized AI employees across enterprise tools
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/ai-manager">
              <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                Open AI Manager
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Card3D key={idx} className="p-4 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{m.label}</span>
                  <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${m.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-100">{m.value}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-mono">
                    <TrendingUp className="w-3 h-3" />
                    <span>{m.change}</span>
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* 3D Agent Command Center Topology & Live Agents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Central Topology Visualization */}
          <Card3D glowColor="indigo" className="lg:col-span-2 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Digital AI Workforce Topology
                </h3>
                <p className="text-xs text-slate-400">Live orchestration status of specialized AI employees</p>
              </div>
              <Badge variant="success">All Systems Operational</Badge>
            </div>

            {/* Central Node Visualizer */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative space-y-6">
              {/* Central AI Manager */}
              <div className="flex items-center justify-center">
                <div className="px-6 py-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-500/20 border border-indigo-400/30 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>HR AI MANAGER (Orchestrator)</span>
                </div>
              </div>

              {/* Connected Agents Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 hover:border-indigo-500/40 transition-colors"
                  >
                    <AgentAvatar3D emoji={agent.avatar3D} size="sm" status={agent.status} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-200 truncate">{agent.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">{agent.tasksCompleted} tasks</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>

          {/* Pending Human Approvals Column */}
          <Card3D glowColor="amber" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Human Approval Queue
              </h3>
              <Badge variant="warning">{pendingApprovals.length} Pending</Badge>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{app.title}</span>
                    <Badge variant={app.riskLevel === 'critical' ? 'error' : 'warning'}>
                      {app.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{app.reasoning}</p>
                  <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Requested by {app.agentName}</span>
                    <Link href="/approvals" className="text-indigo-400 font-semibold hover:underline">
                      Review &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      </div>
    </HRShell>
  );
}
