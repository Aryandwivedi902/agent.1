'use client';

import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  GitFork,
  Activity,
  CheckCircle2,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  Play,
  Layers,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { label: 'Total HR Workflows', value: '24', change: '+3 new this week', icon: GitFork, color: 'text-indigo-400' },
    { label: 'Active HR Agents', value: '18', change: '100% operational', icon: Zap, color: 'text-emerald-400' },
    { label: 'Automated Runs Today', value: '12,450', change: '+18.4% vs last week', icon: Activity, color: 'text-sky-400' },
    { label: 'Policy Compliance', value: '99.8%', change: 'Zero audit violations', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Resumes Processed', value: '8,234', change: 'Avg 45s per applicant', icon: Sparkles, color: 'text-purple-400' },
  ];

  const recentExecutions = [
    { id: 'exec-hr-98201', workflow: 'Candidate Resume Screening & Onboarding Agent', status: 'success', time: '2 mins ago', duration: '1.8s', items: 1 },
    { id: 'exec-hr-98200', workflow: 'New Hire Onboarding & Equipment Provisioning', status: 'success', time: '15 mins ago', duration: '2.4s', items: 4 },
    { id: 'exec-hr-98199', workflow: 'PTO & Benefits Policy AI Inquiry Desk', status: 'success', time: '28 mins ago', duration: '620ms', items: 1 },
    { id: 'exec-hr-98198', workflow: 'Payroll Change Compliance Audit', status: 'success', time: '1 hour ago', duration: '3.8s', items: 12 },
    { id: 'exec-hr-98197', workflow: 'Quarterly Performance Review Reminder System', status: 'success', time: '3 hours ago', duration: '1.1s', items: 2 },
  ];

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Good Morning, Aryan</h1>
            <p className="text-sm text-slate-400">Overview of your AI agent automation platform performance</p>
          </div>

          <Link href="/">
            <Button variant="primary" icon={<Play className="w-4 h-4 fill-current" />}>
              Open Workflow Canvas
            </Button>
          </Link>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{stat.label}</span>
                  <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-100">{stat.value}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity & Performance Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Activity Chart Mock */}
          <div className="lg:col-span-2 p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">Workflow Execution Activity</h3>
                <p className="text-xs text-slate-400">Real-time throughput across all active agents</p>
              </div>
              <Badge variant="purple">24 Hour Window</Badge>
            </div>

            {/* Visual Bars for Chart */}
            <div className="h-48 flex items-end gap-2 pt-6 px-2">
              {[45, 60, 35, 80, 95, 120, 110, 85, 130, 150, 140, 160, 180, 210, 195, 220, 240, 210, 260, 280, 290, 310, 275, 330].map(
                (val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      style={{ height: `${(val / 330) * 100}%` }}
                      className="w-full bg-indigo-600/60 group-hover:bg-indigo-500 rounded-t transition-all"
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>00:00 AM</span>
              <span>06:00 AM</span>
              <span>12:00 PM</span>
              <span>06:00 PM</span>
              <span>11:59 PM</span>
            </div>
          </div>

          {/* Top Performing Workflows */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Top Performing Workflows</h3>
            <div className="space-y-3">
              {[
                { name: 'Customer Support AI Agent', runs: '12,430 runs', success: '98.4%' },
                { name: 'Lead Qualification Agent', runs: '8,932 runs', success: '96.2%' },
                { name: 'Employee Onboarding Checklist', runs: '412 runs', success: '100%' },
                { name: 'Sentry Bug Auto-Triage', runs: '1,840 runs', success: '92.1%' },
              ].map((wf, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-800/80 bg-slate-950/60"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200">{wf.name}</span>
                    <span className="text-[10px] text-slate-500">{wf.runs}</span>
                  </div>
                  <Badge variant="success">{wf.success}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Executions Table */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100">Recent Workflow Runs</h3>
            <Link href="/executions" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              View All History &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Execution ID</th>
                  <th className="pb-3 font-semibold">Workflow Name</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Triggered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {recentExecutions.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 text-indigo-400 font-bold">{row.id}</td>
                    <td className="py-3 text-slate-200 font-sans font-medium">{row.workflow}</td>
                    <td className="py-3">
                      <Badge variant={row.status === 'success' ? 'success' : 'error'}>
                        {row.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-300">{row.duration}</td>
                    <td className="py-3 text-slate-300">{row.items}</td>
                    <td className="py-3 text-slate-400 font-sans">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
