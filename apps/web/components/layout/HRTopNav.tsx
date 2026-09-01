'use client';

import React from 'react';
import { Search, Bell, Sparkles, Building2, Command, CheckCircle2 } from 'lucide-react';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';
import { Badge } from '../ui/Badge';

export const HRTopNav: React.FC = () => {
  const { setIsCommandPaletteOpen, selectedProvider, selectedModel, approvals } = useHRAIManagerStore();
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
      {/* Search / Command Palette Trigger */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all text-xs w-64 md:w-80 shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400" />
          <span className="truncate">Search agents, tasks, or press...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800 font-mono ml-auto">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Organization Selector */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold">Northstar Technologies</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-[9px] font-bold text-indigo-300">DEMO ORG</span>
        </div>
      </div>

      {/* Right Telemetry & Actions */}
      <div className="flex items-center gap-3">
        {/* Live System Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>6 Agents Active</span>
          <span className="text-slate-600">|</span>
          <span className="text-indigo-400 font-mono">{selectedModel.split(' ')[0]}</span>
        </div>

        {/* Notifications & Pending Approval alerts */}
        <div className="relative">
          <button
            onClick={() => (window.location.href = '/approvals')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white font-bold rounded-full animate-bounce">
                {pendingApprovalsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
