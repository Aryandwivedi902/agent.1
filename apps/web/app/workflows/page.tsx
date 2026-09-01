'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  GitFork,
  Plus,
  Search,
  MoreVertical,
  Play,
  Copy,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockWorkflows } from '../../services/workflowService';

export default function WorkflowsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockWorkflows.filter((wf) => {
    const matchesStatus = statusFilter === 'all' || wf.status === statusFilter;
    const matchesSearch = wf.name.toLowerCase().includes(searchTerm.toLowerCase()) || wf.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Top Title Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Workflows Library</h1>
            <p className="text-sm text-slate-400">Manage and automate your AI agent processes</p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" icon={<Sparkles className="w-4 h-4 text-indigo-400" />}>
              Import Template
            </Button>
            <Link href="/">
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                Create Workflow
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search workflows by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg">
            {['all', 'published', 'draft', 'archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                  statusFilter === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Workflows Table */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Workflow Name</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Last Execution</th>
                <th className="p-4 font-semibold">Success Rate</th>
                <th className="p-4 font-semibold">Total Runs</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((wf) => (
                <tr key={wf.id} className="hover:bg-slate-850/50 transition-colors group">
                  <td className="p-4">
                    <Link href="/" className="flex flex-col">
                      <span className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors text-sm">
                        {wf.name}
                      </span>
                      <span className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{wf.description}</span>
                    </Link>
                  </td>

                  <td className="p-4">
                    <Badge
                      variant={
                        wf.status === 'published' ? 'success' : wf.status === 'draft' ? 'warning' : 'default'
                      }
                    >
                      {wf.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="p-4 text-slate-300 font-medium">{wf.category || 'General'}</td>

                  <td className="p-4 text-slate-400 font-mono">{wf.lastRun}</td>

                  <td className="p-4 font-mono font-bold text-emerald-400">{wf.successRate}</td>

                  <td className="p-4 font-mono text-slate-300">{(wf.totalRuns ?? 0).toLocaleString()}</td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href="/">
                        <Button variant="outline" size="sm" icon={<Play className="w-3.5 h-3.5 fill-current" />}>
                          Open
                        </Button>
                      </Link>
                      <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
