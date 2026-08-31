'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { Settings, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [country, setCountry] = useState('US');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [locale, setLocale] = useState('en-US');
  const [currency, setCurrency] = useState('USD');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const settings = db.getSettings(activeOrgId);
    if (settings) {
      setCountry(settings.country);
      setTimezone(settings.timezone);
      setLocale(settings.locale);
      setCurrency(settings.currency);
    }
  }, [activeOrgId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(
      activeOrgId,
      { country, timezone, locale, currency },
      currentUser.email
    );
    setIsSuccess(true);
    refreshData();
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <Settings className="w-8 h-8 text-cyan-400" />
          <span>Organization Settings</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Configure country jurisdictions, timezone renderings, and locale formatting.
        </p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
          
          {isSuccess && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-xl text-xs">
              <CheckCircle className="w-4.5 h-4.5 shrink-0" />
              <span>Configurations updated and written to settings database.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Corporate Jurisdiction</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-350 outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="DE">Germany (DE)</option>
                <option value="CA">Canada (CA)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Timezone Context</label>
              <select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-355 outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</option>
                <option value="America/New_York">Eastern Time (America/New_York)</option>
                <option value="Europe/London">Greenwich Mean Time (Europe/London)</option>
                <option value="Europe/Berlin">Central European Time (Europe/Berlin)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Locale formatting</label>
              <input
                type="text"
                required
                value={locale}
                onChange={e => setLocale(e.target.value)}
                className="w-full bg-slate-955 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Base Currency</label>
              <input
                type="text"
                required
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full bg-slate-955 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-955 font-bold text-xs rounded-xl transition-all"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}
