'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Zap, Search, CheckCircle2, Plug, Sparkles, Database, MessageSquare, Table, FileText, Users, GitBranch, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { mockIntegrations } from '../../services/integrationService';

const iconMap: Record<string, any> = {
  Sparkles,
  MessageSquare,
  Database,
  Table,
  FileText,
  Users,
  GitBranch,
  Globe,
};

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', 'AI', 'Communication', 'Databases', 'Productivity', 'CRM', 'Developer Tools'];

  const filtered = mockIntegrations.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">App Integrations Marketplace</h1>
            <p className="text-sm text-slate-400">Connect your AI agents to databases, APIs, and enterprise software</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded text-xs font-semibold shrink-0 transition-colors ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const Icon = iconMap[item.iconName] || Plug;
            return (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={item.isConnected ? 'success' : 'default'}>
                      {item.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{item.name}</h3>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">{item.category}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">{item.authType}</span>
                  <Button variant={item.isConnected ? 'outline' : 'primary'} size="sm">
                    {item.isConnected ? 'Configure' : 'Connect App'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
