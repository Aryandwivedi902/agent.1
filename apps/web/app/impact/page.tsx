'use client';

import React from 'react';
import { HRShell } from '../../components/layout/HRShell';
import { Card3D } from '../../components/ui/Card3D';
import { Badge } from '../../components/ui/Badge';
import { Zap, TrendingUp, CheckCircle2, Clock, ShieldCheck, ArrowRight, Activity, Users } from 'lucide-react';

export default function AIImpactPage() {
  const impactMetrics = [
    { label: 'HOURS SAVED', value: '428 hrs', detail: 'This billing cycle', color: 'text-indigo-400' },
    { label: 'TASKS AUTOMATED', value: '2,840', detail: 'Across 6 agents', color: 'text-emerald-400' },
    { label: 'MANUAL WORK REDUCED', value: '63%', detail: 'Admin work reduction', color: 'text-sky-400' },
    { label: 'FASTER HR RESPONSES', value: '4.2×', detail: 'Speed improvement', color: 'text-purple-400' },
    { label: 'AI SUCCESS RATE', value: '97.8%', detail: 'Clean task executions', color: 'text-emerald-400' },
    { label: 'HUMAN REVIEW RATE', value: '18%', detail: 'Safety approval rate', color: 'text-amber-400' },
  ];

  return (
    <HRShell>
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Zap className="w-6 h-6 text-purple-400" />
              <span>AI Impact & Business ROI Telemetry</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Measurable productivity gain, manual work reduction, and SLA acceleration provided by HR AI Manager
            </p>
          </div>

          <Badge variant="purple">CLIENT VALUE DASHBOARD</Badge>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactMetrics.map((m, idx) => (
            <Card3D key={idx} className="p-6 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
              <div className={`text-3xl font-black ${m.color}`}>{m.value}</div>
              <span className="text-[11px] text-slate-500 font-mono">{m.detail}</span>
            </Card3D>
          ))}
        </div>

        {/* Before vs With HR AI Manager Comparison Diagram */}
        <Card3D glowColor="indigo" className="p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 text-center">
            Enterprise Transformation: Before vs. With HR AI Manager
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Before AI Box */}
            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-4">
              <span className="px-3 py-1 rounded font-bold text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                BEFORE AI
              </span>
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">HR Team Overwhelmed</div>
                <div className="text-center text-slate-600">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">Manual Search (Handbooks/Emails)</div>
                <div className="text-center text-slate-600">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">Manual Candidate Screening</div>
                <div className="text-center text-slate-600">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">Slow 48-Hour Response SLA</div>
              </div>
            </div>

            {/* With HR AI Manager Box */}
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
              <span className="px-3 py-1 rounded font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                WITH HR AI MANAGER
              </span>
              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center text-indigo-300 font-bold">
                  User / Employee Request
                </div>
                <div className="text-center text-indigo-400">↓</div>
                <div className="p-2.5 rounded-lg bg-indigo-600 text-white font-bold text-center">
                  HR AI Manager Orchestration
                </div>
                <div className="text-center text-indigo-400">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-indigo-500/40 text-center text-emerald-300">
                  Specialized Digital AI Workforce
                </div>
                <div className="text-center text-indigo-400">↓</div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center text-emerald-400 font-bold">
                  Completed in Seconds (Human Control Enabled)
                </div>
              </div>
            </div>
          </div>
        </Card3D>
      </div>
    </HRShell>
  );
}
