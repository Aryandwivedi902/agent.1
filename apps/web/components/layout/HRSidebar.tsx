'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Bot,
  GitFork,
  CheckCircle2,
  BookOpen,
  Users,
  BarChart3,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Home,
  ShieldAlert,
} from 'lucide-react';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';

export const HRSidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme, setIsCommandPaletteOpen } = useHRAIManagerStore();

  const navItems = [
    { label: 'Landing / Product', href: '/landing', icon: Home },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Manager Workspace', href: '/ai-manager', icon: Sparkles },
    { label: 'Digital AI Workforce', href: '/agents', icon: Bot },
    { label: 'Approval Center', href: '/approvals', icon: ShieldAlert },
    { label: 'Workflows Builder', href: '/workflows', icon: GitFork },
    { label: 'Knowledge Base RAG', href: '/knowledge', icon: BookOpen },
    { label: 'Recruitment Desk', href: '/recruitment', icon: Users },
    { label: 'Analytics Telemetry', href: '/analytics', icon: BarChart3 },
    { label: 'AI Business Impact', href: '/impact', icon: Zap },
    { label: 'Settings & API Keys', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl text-slate-300 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-slate-100 text-base">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-indigo-200 via-white to-slate-200 bg-clip-text text-transparent font-extrabold tracking-tight">
                HR AI MANAGER
              </span>
              <span className="text-[10px] text-indigo-400 font-mono">Enterprise AI OS</span>
            </div>
          </Link>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-indigo-300 border border-indigo-500/30 shadow-md shadow-indigo-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Footer Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-md">
              AD
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-100 truncate">Aryan Dwivedi</span>
                <span className="text-[10px] text-slate-400 truncate">HR Director (Northstar Tech)</span>
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors shrink-0"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
