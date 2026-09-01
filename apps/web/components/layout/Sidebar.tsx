'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GitFork,
  Bot,
  Layers,
  Activity,
  Zap,
  Key,
  Users,
  BarChart3,
  Settings,
  Plus,
  Folder,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useWorkflowStore();

  const navItems = [
    { label: 'Workflows', href: '/', icon: GitFork },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'AI Agents', href: '/ai-manager', icon: Bot },
    { label: 'Executions', href: '/executions', icon: Activity },
    { label: 'Integrations', href: '/integrations', icon: Zap },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const projects = [
    { name: 'Personal Workspace', active: true },
    { name: 'Marketing Automation', active: false },
    { name: 'AI Research', active: false },
    { name: 'Customer Support', active: false },
    { name: 'Production', active: false },
  ];

  return (
    <aside
      className={`relative flex flex-col h-screen border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-slate-800">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 font-bold text-slate-100 text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="bg-gradient-to-r from-indigo-300 via-white to-slate-300 bg-clip-text text-transparent">
              HRFlow AI
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* HR Projects Section */}
        {!collapsed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>HR Departments</span>
              <button className="p-1 hover:text-slate-200 hover:bg-slate-800 rounded">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5">
              {[
                { name: 'Global HR Operations', active: true },
                { name: 'Talent Acquisition', active: false },
                { name: 'Employee Onboarding', active: false },
                { name: 'Payroll & Compensation', active: false },
                { name: 'HR Compliance & Legal', active: false },
              ].map((proj, idx) => (
                <button
                  key={idx}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                    proj.active ? 'text-slate-200 bg-slate-900 font-medium' : 'text-slate-400 hover:text-slate-300 hover:bg-slate-900/50'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{proj.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Profile & Theme Toggle */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
              AD
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate">Aryan Dwivedi</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 truncate">Personal Org</span>
                  <span className="px-1 py-0.2 text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">PRO</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
