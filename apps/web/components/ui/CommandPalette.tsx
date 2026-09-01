'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bot,
  GitFork,
  CheckCircle2,
  FileText,
  Users,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Zap,
} from 'lucide-react';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useHRAIManagerStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const items = [
    { title: 'HR AI Manager Command Center', type: 'View', href: '/ai-manager', icon: Sparkles },
    { title: 'Email Agent Configuration', type: 'Agent', href: '/agents', icon: Bot },
    { title: 'Recruitment & Candidate Screening Agent', type: 'Agent', href: '/agents', icon: Bot },
    { title: 'Human-in-the-Loop Approval Queue (3 Pending)', type: 'Action', href: '/approvals', icon: CheckCircle2 },
    { title: 'Candidate Resume Screening & Onboarding Workflow', type: 'Workflow', href: '/workflows', icon: GitFork },
    { title: '2026 Health & Medical Benefits Handbook', type: 'Knowledge', href: '/knowledge', icon: FileText },
    { title: 'Talent Acquisition Candidate Pipeline', type: 'Recruitment', href: '/recruitment', icon: Users },
    { title: 'AI Business Impact & ROI Telemetry', type: 'Impact', href: '/impact', icon: Zap },
    { title: 'Workspace LLM API Keys & Provider Settings', type: 'Settings', href: '/settings', icon: Settings },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-4 h-4 text-indigo-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, agent, workflow, or search documents... (ESC to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none font-medium"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar text-xs">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(item.href)}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-400 border border-slate-800 uppercase font-mono">
                    {item.type}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
