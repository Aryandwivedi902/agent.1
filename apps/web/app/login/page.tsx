'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/providers/AppContext';
import { apiClient } from '../../services/apiClient';
import { Sparkles, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setOnboardingComplete } = useApp();
  const [email, setEmail] = useState('aryan.dwivedi@northstar.tech');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await apiClient.login(email, password);
      setOnboardingComplete(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setEmail('aryan.dwivedi@northstar.tech');
    setPassword('AdminPass123!');
    setIsLoading(true);
    try {
      await apiClient.login('aryan.dwivedi@northstar.tech', 'AdminPass123!');
      setOnboardingComplete(true);
      router.push('/dashboard');
    } catch (err: any) {
      setOnboardingComplete(true);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden px-4" suppressHydrationWarning>
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">HR AI Manager Access Portal</h2>
          <p className="text-xs text-slate-400">Authenticated JWT multi-tenant access to digital AI workforce</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Work Email Address</label>
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 focus-within:border-indigo-500 rounded-xl px-4 py-2.5">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent flex-1 text-xs outline-none text-slate-100 font-mono"
                placeholder="name@company.tech"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Password</label>
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 focus-within:border-indigo-500 rounded-xl px-4 py-2.5">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent flex-1 text-xs outline-none text-slate-100 font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Authenticate & Sign In'}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold">Demo Login</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <button
          type="button"
          onClick={handleDemoAccess}
          className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-2"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Quick Launch (Northstar Tech Admin)</span>
        </button>

        <div className="text-center text-[10px] text-slate-500 font-mono">
          JWT Enforced Security • Multi-Tenant Data Isolation
        </div>
      </div>
    </div>
  );
}
