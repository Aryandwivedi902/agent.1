'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { History, Search, ShieldCheck } from 'lucide-react';

export default function AuditLogs() {
  const { activeOrgId } = useApp();
  const [logs, setLogs] = useState<any[]>([]);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setLogs(db.getAuditLogs(activeOrgId));
  }, [activeOrgId]);

  const filteredLogs = logs.filter(log => {
    const query = filterQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.actor.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <History className="w-8 h-8 text-cyan-400" />
          <span>Security & Operations Audit Trail</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Immutably trace authentication events, document access, tool coordinates, and agent configurations change.
        </p>
      </div>

      {/* Filter and Table View */}
      <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
        
        {/* Search Bar */}
        <div className="flex items-center space-x-3 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Filter logs by action, details, actor..."
            className="bg-transparent flex-1 outline-none text-xs text-slate-300 placeholder-slate-600"
          />
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850 text-slate-400 font-semibold bg-slate-950/20">
                <th className="p-3">Timestamp (UTC)</th>
                <th className="p-3">Actor / Entity</th>
                <th className="p-3">Action Signature</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">Result</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="border-b border-slate-850/60 hover:bg-slate-900/10 text-slate-350 transition-colors">
                    <td className="p-3 font-mono text-[10px] text-slate-500">
                      {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-300">{log.actor}</span>
                      <span className="text-[9px] bg-slate-950 text-slate-500 border border-slate-850 rounded px-1 ml-1.5 uppercase font-bold">
                        {log.actorType}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-cyan-400">{log.action}</td>
                    <td className="p-3 font-mono">{log.resource}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border uppercase ${
                        log.result === 'success'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-900/30'
                          : 'bg-rose-950 text-rose-400 border-rose-900/30'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 leading-relaxed font-sans">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No matching audit records recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
