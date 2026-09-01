'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Activity, Search, Filter, CheckCircle2, AlertCircle, Clock, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockExecutions } from '../../services/executionService';

export default function ExecutionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExec, setSelectedExec] = useState<any>(null);

  const filtered = mockExecutions.filter((exec) =>
    exec.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) || exec.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Execution History</h1>
            <p className="text-sm text-slate-400">Detailed logs, timing, and payload inspector across all runs</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search execution by ID or workflow..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <Badge variant="purple">Total Logs: {mockExecutions.length}</Badge>
        </div>

        {/* Executions Table */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Execution ID</th>
                <th className="p-4 font-semibold">Workflow</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Trigger</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Started At</th>
                <th className="p-4 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4 font-bold text-indigo-400">{row.id}</td>
                  <td className="p-4 text-slate-200 font-sans font-medium">{row.workflowName}</td>
                  <td className="p-4">
                    <Badge variant={row.status === 'success' ? 'success' : 'error'}>
                      {row.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-300 font-sans">{row.triggerType}</td>
                  <td className="p-4 text-indigo-300">{row.durationMs}ms</td>
                  <td className="p-4 text-slate-400 font-sans">{row.startedAt}</td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExec(row)}
                      icon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inspector Modal */}
        {selectedExec && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Execution Inspector: {selectedExec.id}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedExec(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Workflow: {selectedExec.workflowName}</span>
                  <span>Duration: {selectedExec.durationMs}ms</span>
                </div>

                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px]">
                  {JSON.stringify(selectedExec, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
