'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { CheckSquare, AlertTriangle, ShieldCheck, Check, X, Edit2, Play } from 'lucide-react';

export default function ApprovalsCenter() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [approvals, setApprovals] = useState<any[]>([]);
  
  // States for editing before approving
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [editTo, setEditTo] = useState('');

  useEffect(() => {
    const list = db.getApprovals(activeOrgId);
    setApprovals(list);
  }, [activeOrgId]);

  const handleApprove = (id: string) => {
    db.approveApproval(activeOrgId, id, currentUser.email);
    setApprovals(db.getApprovals(activeOrgId));
    refreshData();
  };

  const handleReject = (id: string) => {
    db.rejectApproval(activeOrgId, id, currentUser.email);
    setApprovals(db.getApprovals(activeOrgId));
    refreshData();
  };

  const handleStartEdit = (app: any) => {
    setEditingId(app.id);
    setEditBody(app.payload.body || '');
    setEditTo(app.payload.to || '');
  };

  const handleSaveAndApprove = (id: string) => {
    const original = approvals.find(a => a.id === id);
    if (original) {
      // Modify payload
      const updatedPayload = {
        ...original.payload,
        body: editBody,
        to: editTo
      };
      
      // Update record in mock database directly
      original.payload = updatedPayload;
      
      // Approve it
      db.approveApproval(activeOrgId, id, currentUser.email);
      setEditingId(null);
      setApprovals(db.getApprovals(activeOrgId));
      refreshData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <CheckSquare className="w-8 h-8 text-cyan-400" />
          <span>Human Approval Center</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Authorize AI agent draft outputs and database mutation transactions before execution.
        </p>
      </div>

      {/* Main Board Grid */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-300 border-b border-slate-850 pb-2">Pending Transactions Queue</h3>
        
        <div className="space-y-4">
          {approvals.filter(a => a.status === 'pending').length > 0 ? (
            approvals.filter(a => a.status === 'pending').map(app => {
              const isEditing = editingId === app.id;

              return (
                <div key={app.id} className="p-6 bg-slate-900/40 border border-slate-850 rounded-2xl backdrop-blur-md space-y-4 relative overflow-hidden">
                  
                  {/* Left-edge risk indicator accent */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    app.riskLevel === 'HIGH' ? 'bg-rose-500' : app.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-cyan-500'
                  }`} />

                  {/* Top Bar of request */}
                  <div className="flex justify-between items-start pl-2">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-200 text-sm tracking-wide">
                          {app.actionType.toUpperCase().replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${
                          app.riskLevel === 'HIGH' 
                            ? 'bg-rose-950/20 text-rose-400 border-rose-900/30' 
                            : 'bg-amber-950/20 text-amber-400 border-amber-900/30'
                        }`}>
                          {app.riskLevel} RISK
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block mt-1">Requested by {app.requestedBy} • {new Date(app.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveAndApprove(app.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save & Approve</span>
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold transition-all border border-slate-700/50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Approve & Run</span>
                          </button>
                          <button
                            onClick={() => handleStartEdit(app)}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700/50 flex items-center space-x-1"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Payload</span>
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/20 hover:text-rose-400 text-slate-400 text-xs font-bold transition-all border border-slate-700/50 flex items-center space-x-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Body Payload Section */}
                  <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 ml-2 space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">To Email</label>
                          <input
                            type="text"
                            value={editTo}
                            onChange={e => setEditTo(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Message Body</label>
                          <textarea
                            value={editBody}
                            onChange={e => setEditBody(e.target.value)}
                            rows={4}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 outline-none font-sans"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs space-y-2">
                        {app.payload.to && (
                          <div>
                            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Recipient Email Target</span>
                            <span className="text-slate-300 font-mono">{app.payload.to}</span>
                          </div>
                        )}
                        {app.payload.body && (
                          <div>
                            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Generated Text Payload</span>
                            <span className="text-slate-300 font-sans block mt-1 whitespace-pre-wrap">{app.payload.body}</span>
                          </div>
                        )}
                        {app.payload.salary && (
                          <div>
                            <span className="text-slate-500 font-semibold block uppercase text-[10px]">Salary Mutation Parameter</span>
                            <span className="text-slate-300 font-mono text-emerald-400 font-bold">{app.payload.salary}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Evidence & Warnings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-2 text-xs">
                    {/* Evidence */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Agent Citation Evidence</span>
                      <p className="text-slate-400 leading-relaxed">{app.evidence}</p>
                    </div>
                    {/* Warnings */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Validation Checks Warnings</span>
                      {app.warnings.map((w: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-amber-400 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-900/10 border border-slate-850 rounded-2xl text-slate-500 text-sm">
              All agent action transactions are verified. Approvals queue is clean.
            </div>
          )}
        </div>

        {/* Audit / Completed section */}
        <div className="pt-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-300 border-b border-slate-850 pb-2">Recent Execution History</h3>
          <div className="space-y-2">
            {approvals.filter(a => a.status !== 'pending').length > 0 ? (
              approvals.filter(a => a.status !== 'pending').map(app => (
                <div key={app.id} className="p-4 bg-slate-900/10 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-300 block">{app.actionType.toUpperCase().replace('_', ' ')}</span>
                    <span className="text-slate-500">Requested by {app.requestedBy}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] border ${
                    app.status === 'executed' || app.status === 'approved'
                      ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
                      : 'bg-rose-950/20 text-rose-400 border-rose-900/30'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-600">No transactions archived yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
