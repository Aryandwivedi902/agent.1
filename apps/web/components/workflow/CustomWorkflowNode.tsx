'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import {
  Webhook,
  Code,
  Bot,
  Database,
  GitFork,
  Send,
  Ticket,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Copy,
  SlidersHorizontal,
} from 'lucide-react';
import { WorkflowNodeData, NodeCategory } from '../../types/workflow';
import { useWorkflowStore } from '../../store/useWorkflowStore';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Webhook,
  Code,
  Bot,
  Database,
  GitFork,
  Send,
  Ticket,
  Zap,
  Play,
};

const categoryTheme: Record<NodeCategory, { border: string; bg: string; text: string; badgeBg: string }> = {
  trigger: {
    border: 'border-emerald-500/40 hover:border-emerald-500',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  ai: {
    border: 'border-indigo-500/40 hover:border-indigo-500',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  logic: {
    border: 'border-amber-500/40 hover:border-amber-500',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  integration: {
    border: 'border-sky-500/40 hover:border-sky-500',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
  output: {
    border: 'border-purple-500/40 hover:border-purple-500',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
};

export const CustomWorkflowNode: React.FC<NodeProps<any>> = memo(({ id, data, selected }) => {
  const nodeData = data as WorkflowNodeData;
  const { deleteNode, duplicateNode, setSelectedNodeId } = useWorkflowStore();
  const theme = categoryTheme[nodeData.category] || categoryTheme.ai;
  const IconComponent = iconMap[nodeData.iconName] || Zap;

  return (
    <div
      onClick={() => setSelectedNodeId(id)}
      className={`group relative w-72 rounded-xl bg-slate-900 border-2 ${
        selected ? 'border-indigo-500 ring-4 ring-indigo-500/20 shadow-xl shadow-indigo-500/10' : theme.border
      } transition-all duration-150 shadow-lg shadow-black/40 cursor-pointer`}
    >
      {/* Node Input Handle (Left) */}
      {nodeData.category !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3.5 !h-3.5 !bg-slate-700 !border-2 !border-indigo-400 hover:!bg-indigo-500 transition-colors"
        />
      )}

      {/* Node Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800/80 bg-slate-950/40 rounded-t-xl">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${theme.bg} flex items-center justify-center ${theme.text}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-100 line-clamp-1">{nodeData.label}</span>
            <span className="text-[10px] font-medium text-slate-400 capitalize">{nodeData.category}</span>
          </div>
        </div>

        {/* Execution Status Pill */}
        {nodeData.status === 'running' && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse">
            <Clock className="w-3 h-3 animate-spin" /> Running
          </span>
        )}
        {nodeData.status === 'success' && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" /> {nodeData.executionTimeMs ? `${nodeData.executionTimeMs}ms` : 'Passed'}
          </span>
        )}
        {nodeData.status === 'error' && (
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <AlertCircle className="w-3 h-3" /> Error
          </span>
        )}
      </div>

      {/* Node Description & Key Params */}
      <div className="p-3 text-xs text-slate-400 space-y-2">
        <p className="leading-relaxed line-clamp-2">{nodeData.description}</p>
        
        {nodeData.config?.model && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-950 text-indigo-300 border border-slate-800 font-mono">
            Model: {nodeData.config.model}
          </div>
        )}
      </div>

      {/* Hover Action Menu */}
      <div className="absolute -top-3 right-2 hidden group-hover:flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-md p-1 shadow-md">
        <button
          onClick={(e) => {
            e.stopPropagation();
            duplicateNode(id);
          }}
          className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded"
          title="Duplicate step"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteNode(id);
          }}
          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded"
          title="Delete step"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Node Output Handle (Right) */}
      {nodeData.category !== 'output' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3.5 !h-3.5 !bg-slate-700 !border-2 !border-indigo-400 hover:!bg-indigo-500 transition-colors"
        />
      )}
    </div>
  );
});

CustomWorkflowNode.displayName = 'CustomWorkflowNode';
