'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { useWorkflowStore } from '../../store/useWorkflowStore';

interface AppLayoutProps {
  children: React.ReactNode;
  showTopHeader?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme } = useWorkflowStore();

  return (
    <div className={`${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex h-screen w-screen overflow-hidden antialiased font-sans`}>
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden bg-slate-950">
        {children}
      </div>
    </div>
  );
};
