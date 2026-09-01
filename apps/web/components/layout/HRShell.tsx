'use client';

import React from 'react';
import { HRSidebar } from './HRSidebar';
import { HRTopNav } from './HRTopNav';
import { CommandPalette } from '../ui/CommandPalette';
import { useHRAIManagerStore } from '../../store/useHRAIManagerStore';

interface HRShellProps {
  children: React.ReactNode;
}

export const HRShell: React.FC<HRShellProps> = ({ children }) => {
  const { theme } = useHRAIManagerStore();

  return (
    <div className={`${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex h-screen w-screen overflow-hidden antialiased font-sans select-none`}>
      <HRSidebar />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden bg-slate-950 relative">
        <HRTopNav />
        <main className="flex-1 overflow-hidden flex flex-col relative">{children}</main>
        <CommandPalette />
      </div>
    </div>
  );
};
