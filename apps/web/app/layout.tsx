'use client';

import React from 'react';
import { AppProvider, useApp } from '../components/providers/AppContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Mail,
  FileQuestion,
  Users,
  Award,
  BookOpen,
  BarChart3,
  CheckSquare,
  FileSpreadsheet,
  Globe,
  Settings,
  History,
  ShieldCheck,
  Building,
  UserCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import './globals.css';
import InteractiveBackground from '../components/InteractiveBackground';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    activeOrgId,
    setActiveOrgId,
    currentUser,
    setCurrentUser,
    usersList,
    resetDatabase,
    onboardingComplete
  } = useApp();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLandingOrLoginOrOnboard =
    pathname === '/' || pathname === '/login' || pathname === '/onboarding';

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Manager', path: '/ai-manager', icon: Bot },
    { name: 'Email', path: '/email', icon: Mail },
    { name: 'Requests', path: '/requests', icon: FileQuestion },
    { name: 'Recruitment', path: '/recruitment', icon: Users },
    { name: 'Onboarding', path: '/onboarding-hr', icon: Award },
    { name: 'Policies & Knowledge', path: '/policies', icon: BookOpen },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Approvals', path: '/approvals', icon: CheckSquare },
    { name: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { name: 'Employees', path: '/employees', icon: ShieldCheck },
    { name: 'Integrations', path: '/integrations', icon: Globe },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Audit Log', path: '/audit-log', icon: History }
  ];

  // Route to onboarding wizard if not complete
  React.useEffect(() => {
    if (mounted && !onboardingComplete && !isLandingOrLoginOrOnboard) {
      router.push('/onboarding');
    }
  }, [mounted, onboardingComplete, isLandingOrLoginOrOnboard, router]);

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-semibold text-sm" suppressHydrationWarning>Loading HRFlow AI...</div>;
  }

  if (isLandingOrLoginOrOnboard) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">{children}</div>;
  }

  // Find users for the current organization to populate switchers
  const filteredUsers = usersList.filter(u => u.organizationId === activeOrgId);

  return (
    <div className="flex h-screen bg-slate-950/40 text-slate-100 overflow-hidden font-sans" suppressHydrationWarning>
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-850 flex flex-col backdrop-blur-md shrink-0">
        {/* Title Brand */}
        <div className="p-6 border-b border-slate-850 flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              HRFlow AI
            </h1>
            <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">
              Agent Ops Platform
            </span>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-250 group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-900/40 to-indigo-900/40 border-l-2 border-cyan-500 text-cyan-200'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Reset Database Button at bottom */}
        <div className="p-4 border-t border-slate-850">
          <button
            onClick={() => {
              if (confirm('Reset simulated database back to default seed?')) {
                resetDatabase();
                router.push('/onboarding');
              }
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 border border-rose-900/40 hover:bg-rose-950/20 hover:text-rose-300 transition-all duration-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Database</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Operational Bar */}
        <header className="h-16 border-b border-slate-850 bg-slate-900/40 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <Building className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-300">
              {activeOrgId === 'org-acme' ? 'Acme Corp (US)' : 'Globex Corp (UK)'}
            </span>
            <span className="text-slate-700">|</span>
            <UserCheck className="w-4 h-4 text-slate-500" />
            <span className="font-medium text-slate-300">
              {currentUser.firstName} {currentUser.lastName} ({currentUser.role})
            </span>
          </div>

          {/* Context Switchers for Sandbox Testing */}
          <div className="flex items-center space-x-3">
            {/* Organization Toggle */}
            <div className="flex items-center space-x-1.5 bg-slate-850/80 px-2 py-1 rounded-md border border-slate-800">
              <label className="text-[10px] uppercase font-bold text-slate-500">Tenant:</label>
              <select
                value={activeOrgId}
                onChange={e => setActiveOrgId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-300 outline-none cursor-pointer border-none p-0"
              >
                <option value="org-acme">Acme Corp (US)</option>
                <option value="org-globex">Globex Corp (UK)</option>
              </select>
            </div>

            {/* Active User Toggle */}
            <div className="flex items-center space-x-1.5 bg-slate-850/80 px-2 py-1 rounded-md border border-slate-800">
              <label className="text-[10px] uppercase font-bold text-slate-500">Actor Role:</label>
              <select
                value={currentUser.id}
                onChange={e => {
                  const selected = filteredUsers.find(u => u.id === e.target.value);
                  if (selected) setCurrentUser(selected);
                }}
                className="bg-transparent text-xs font-semibold text-slate-300 outline-none cursor-pointer border-none p-0"
              >
                {filteredUsers.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-transparent relative">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body className="h-full antialiased selection:bg-cyan-500/35" suppressHydrationWarning>
        <AppProvider>
          <InteractiveBackground />
          <MainLayoutContent>{children}</MainLayoutContent>
        </AppProvider>
      </body>
    </html>
  );
}
