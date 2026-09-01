'use client';

import React from 'react';
import { AgentStatus } from '../../types/hr-ai';

interface AgentAvatar3DProps {
  emoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: AgentStatus;
  className?: string;
}

export const AgentAvatar3D: React.FC<AgentAvatar3DProps> = ({
  emoji,
  size = 'md',
  status = 'online',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-xl',
    lg: 'w-14 h-14 text-2xl',
    xl: 'w-20 h-20 text-4xl',
  };

  const statusColors: Record<AgentStatus, string> = {
    online: 'bg-emerald-500 shadow-emerald-500/50',
    working: 'bg-indigo-500 shadow-indigo-500/50 animate-pulse',
    waiting: 'bg-amber-500 shadow-amber-500/50',
    approval_required: 'bg-rose-500 shadow-rose-500/50 animate-ping',
    completed: 'bg-emerald-400 shadow-emerald-400/50',
    failed: 'bg-rose-600 shadow-rose-600/50',
    offline: 'bg-slate-600 shadow-slate-600/50',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* 3D Floating Avatar Box */}
      <div
        className={`${sizeStyles[size]} rounded-2xl bg-gradient-to-tr from-slate-800 via-indigo-950 to-slate-900 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10 transform transition-transform hover:scale-105 hover:rotate-2`}
      >
        <span className="drop-shadow-md select-none">{emoji}</span>
      </div>

      {/* Status Dot Pill */}
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${statusColors[status]} shadow-md`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
