'use client';

import React from 'react';
import { HRShell } from '../../components/layout/HRShell';
import { Card3D } from '../../components/ui/Card3D';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ShieldAlert, CheckCircle2, XCircle, Edit3, AlertTriangle, FileCode } from 'lucide-react';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';

export default function ApprovalsPage() {
  const { approvals, handleApprovalAction } = useHRAIManagerStore();

  return (
    <HRShell>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
              <span>Human-in-the-Loop Approval Center</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review, modify, or authorize sensitive actions requested by digital AI employees before execution
            </p>
          </div>

          <Badge variant="purple">{approvals.filter((a) => a.status === 'pending').length} Action Items Pending</Badge>
        </div>

        {/* Approval Queue List */}
        <div className="space-y-4 max-w-4xl">
          {approvals.map((item) => (
            <Card3D key={item.id} glowColor={item.riskLevel === 'critical' ? 'purple' : 'amber'} className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-indigo-400">{item.agentName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-500 font-mono">{item.requestedAt}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{item.title}</h3>
                </div>

                <Badge variant={item.riskLevel === 'critical' ? 'error' : item.riskLevel === 'high' ? 'warning' : 'info'}>
                  {item.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>

              {/* Reasoning & Payload Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    AI Agent Reasoning
                  </span>
                  <p className="text-slate-300 leading-relaxed">{item.reasoning}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Affected System Data
                  </span>
                  <p className="text-amber-300 font-mono">{item.affectedData}</p>
                </div>
              </div>

              {/* Structured JSON Payload Inspector */}
              <pre className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-emerald-400 font-mono text-[11px] overflow-x-auto">
                {JSON.stringify(item.payload, null, 2)}
              </pre>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Status: <strong className="text-slate-300 uppercase">{item.status}</strong>
                </span>

                {item.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon={<Edit3 className="w-3.5 h-3.5 text-slate-400" />}>
                      Modify Payload
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleApprovalAction(item.id, 'reject')}
                      icon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Reject Action
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprovalAction(item.id, 'approve')}
                      icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Authorize & Execute
                    </Button>
                  </div>
                ) : (
                  <Badge variant={item.status === 'approved' ? 'success' : 'error'}>
                    ACTION {item.status.toUpperCase()}
                  </Badge>
                )}
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </HRShell>
  );
}
