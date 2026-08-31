'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { Globe, Shield, RefreshCw } from 'lucide-react';

export default function IntegrationsHub() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    setIntegrations(db.getIntegrations(activeOrgId));
  }, [activeOrgId]);

  const handleToggle = (id: string) => {
    db.toggleIntegration(activeOrgId, id, currentUser.email);
    setIntegrations(db.getIntegrations(activeOrgId));
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <Globe className="w-8 h-8 text-cyan-400" />
          <span>Integration Hub</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Coordinate external provider adapters for calendar sync and directory provisioning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map(int => (
          <div key={int.id} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-slate-200 block text-md">{int.providerName}</span>
                <span className="text-xs text-slate-500 block mt-1">Provider ID: {int.id}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider border uppercase ${
                int.status === 'connected'
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-900/30'
                  : 'bg-slate-950 text-slate-500 border-slate-850'
              }`}>
                {int.status}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Connect corporate workspace accounts to sync communication data with Email and Onboarding agents.
            </p>

            <div className="flex justify-between items-center pt-3 border-t border-slate-850">
              <span className="text-[10px] text-slate-600 font-mono">
                {int.lastConnected ? `Connected ${new Date(int.lastConnected).toLocaleDateString()}` : 'Disconnected'}
              </span>
              <button
                type="button"
                onClick={() => handleToggle(int.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  int.status === 'connected'
                    ? 'bg-rose-950/20 text-rose-400 border-rose-900/30 hover:bg-rose-950/40'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-transparent'
                }`}
              >
                {int.status === 'connected' ? 'Disconnect' : 'Connect Account'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
