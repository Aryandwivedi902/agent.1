'use client';

import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Trash2,
  Play,
  X,
  FileCode,
} from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const ExecutionLogsPanel: React.FC = () => {
  const {
    isExecutionPanelOpen,
    setIsExecutionPanelOpen,
    executionStatus,
    executionLogs,
    clearExecutionLogs,
    isExecuting,
  } = useWorkflowStore();

  const [activeTab, setActiveTab] = useState<'timeline' | 'json' | 'errors'>('timeline');
  const [copied, setCopied] = useState(false);

  if (!isExecutionPanelOpen) {
    return (
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => setIsExecutionPanelOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 shadow-xl hover:text-white hover:border-slate-700 transition-all"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Execution Logs ({executionLogs.length})</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  const sampleJsonOutput = {
    workflowId: 'wf-customer-support-01',
    executionId: `exec-${Date.now()}`,
    status: executionStatus,
    totalDurationMs: executionLogs.reduce((acc, curr) => acc + curr.durationMs, 0),
    stepsCount: executionLogs.length,
    output: {
      action: 'Send Customer Reply',
      channel: 'Email',
      recipient: 'john.doe@acme.com',
      replyMessage: 'Hello John! To reset your API credentials, go to Settings > API Credentials.',
      confidenceScore: 0.94,
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleJsonOutput, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-64 border-t border-slate-800 bg-slate-950 flex flex-col z-20 shrink-0 shadow-2xl animate-in slide-in-from-bottom duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Workflow Execution Output</span>
          </div>

          <Badge
            variant={
              executionStatus === 'running'
                ? 'purple'
                : executionStatus === 'success'
                ? 'success'
                : executionStatus === 'error'
                ? 'error'
                : 'default'
            }
          >
            {executionStatus === 'running' && <Clock className="w-3 h-3 animate-spin mr-1" />}
            {executionStatus.toUpperCase()}
          </Badge>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                activeTab === 'timeline' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Steps Timeline
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                activeTab === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JSON Output
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {activeTab === 'json' && (
            <Button variant="outline" size="sm" onClick={handleCopyJson} icon={<Copy className="w-3.5 h-3.5" />}>
              {copied ? 'Copied!' : 'Copy JSON'}
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearExecutionLogs}
            icon={<Trash2 className="w-3.5 h-3.5 text-slate-400" />}
          >
            Clear
          </Button>

          <button
            onClick={() => setIsExecutionPanelOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-xs">
        {activeTab === 'timeline' && (
          <div className="space-y-2">
            {executionLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-2">
                <Play className="w-6 h-6 text-slate-600" />
                <p>Click "Run Workflow" in the top bar to simulate execution steps</p>
              </div>
            ) : (
              executionLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-200 font-mono"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-slate-100">{log.nodeName}</span>
                    <span className="text-[10px] text-slate-500">[{log.timestamp}]</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800 text-[11px]">
                      {log.durationMs}ms
                    </span>
                    <span className="text-emerald-400 font-semibold">Completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'json' && (
          <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono text-[11px] overflow-x-auto">
            {JSON.stringify(sampleJsonOutput, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
