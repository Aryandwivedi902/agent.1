'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import Link from 'next/link';
import {
  Users,
  CheckSquare,
  FileQuestion,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Bot
} from 'lucide-react';

export default function Dashboard() {
  const { activeOrgId, currentUser } = useApp();
  const [metrics, setMetrics] = useState({
    employees: 0,
    requests: 0,
    approvals: 0,
    policies: 0
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [openRequests, setOpenRequests] = useState<any[]>([]);

  useEffect(() => {
    // Read stats from simulated database
    const emps = db.getEmployees(activeOrgId);
    const reqs = db.getRequests(activeOrgId);
    const apps = db.getApprovals(activeOrgId);
    const pols = db.getPolicies(activeOrgId);
    const logs = db.getAuditLogs(activeOrgId);

    setMetrics({
      employees: emps.length,
      requests: reqs.filter(r => r.status === 'open').length,
      approvals: apps.filter(a => a.status === 'pending').length,
      policies: pols.length
    });

    setRecentLogs(logs.slice(0, 5));
    setPendingApprovals(apps.filter(a => a.status === 'pending'));
    setOpenRequests(reqs.filter(r => r.status === 'open'));
  }, [activeOrgId]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">HR Operations Dashboard</h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Platform Overview for {activeOrgId === 'org-acme' ? 'Acme Corporation' : 'Globex Corporation'}.
        </p>
      </div>

      {/* Critical Alerts Banner (If approvals are pending) */}
      {metrics.approvals > 0 && (
        <div className="flex items-center justify-between p-4 bg-amber-950/30 border border-amber-900/40 rounded-2xl text-amber-200 text-sm">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              There are **{metrics.approvals} actions pending review** in the Human Approval Center.
            </span>
          </div>
          <Link
            href="/approvals"
            className="flex items-center space-x-1.5 font-bold hover:underline text-amber-400 text-xs shrink-0"
          >
            <span>Review Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Headcount</span>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">{metrics.employees}</h3>
            </div>
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-900/30 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 mt-4">
            <TrendingUp className="w-3 h-3" />
            <span>Active tenant isolation enabled</span>
          </div>
        </div>

        {/* Open Requests */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Unresolved Requests</span>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">{metrics.requests}</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/30 text-indigo-400">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-indigo-400 mt-4">
            <Bot className="w-3 h-3" />
            <span>Monitored by Request Agent</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">{metrics.approvals}</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/30 text-amber-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-amber-400 mt-4">
            <span>Human-in-the-Loop required</span>
          </div>
        </div>

        {/* Company Policies */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Company Policies</span>
              <h3 className="text-3xl font-bold text-slate-100 mt-1">{metrics.policies}</h3>
            </div>
            <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-900/30 text-violet-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[10px] text-violet-400 mt-4">
            <span>Indexed in knowledge RAG</span>
          </div>
        </div>
      </div>

      {/* Main Section split: Activities and Operational Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Approvals and Tickets */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active approvals card */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h4 className="text-md font-bold text-slate-200">Pending Approvals Queue</h4>
              <Link href="/approvals" className="text-xs text-cyan-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map(app => (
                  <div key={app.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-300 block">{app.actionType.replace('_', ' ').toUpperCase()}</span>
                      <span className="text-slate-500">Requested by {app.requestedBy}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 font-bold border border-amber-900/40 uppercase text-[9px]">
                      {app.riskLevel} Risk
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">No pending actions requiring review.</div>
              )}
            </div>
          </div>

          {/* Open Tickets card */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h4 className="text-md font-bold text-slate-200">Open Tickets & Requests</h4>
              <Link href="/requests" className="text-xs text-indigo-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {openRequests.length > 0 ? (
                openRequests.map(req => (
                  <div key={req.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-300 block">{req.title}</span>
                      <span className="text-slate-500">From {req.employeeName}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-medium">
                      {req.priority}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">No open employee tickets.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Recent Audits */}
        <div className="space-y-8">
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h4 className="text-md font-bold text-slate-200">Recent Audit Logs</h4>
              <Link href="/audit-log" className="text-xs text-violet-400 hover:underline">View Log</Link>
            </div>
            <div className="space-y-3.5">
              {recentLogs.map(log => (
                <div key={log.id} className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-semibold text-slate-300">{log.action}</span>
                    <span className="text-slate-600 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed truncate">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
