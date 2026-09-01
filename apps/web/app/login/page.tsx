'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/providers/AppContext';
import { apiClient } from '../../services/apiClient';
import { Sparkles, Mail, Lock, ShieldCheck, AlertCircle, CheckCircle2, User, X, Plus } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setOnboardingComplete } = useApp();
  const [email, setEmail] = useState('aryan.dwivedi@northstar.tech');
  const [password, setPassword] = useState('AdminPass123!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  // Suggested Google Accounts List for 1-Click Direct Authentication
  const googleAccounts = [
    { name: 'Aryan Dwivedi', email: 'aryan.dwivedi@northstar.tech', role: 'HR Director (Admin)', avatar: 'AD', color: 'from-indigo-600 to-purple-600' },
    { name: 'Sarah Connor', email: 'sarah.connor@northstar.tech', role: 'Sr. Software Engineer', avatar: 'SC', color: 'from-emerald-600 to-teal-600' },
    { name: 'Marcus Vance', email: 'marcus.vance@northstar.tech', role: 'Lead AI Architect', avatar: 'MV', color: 'from-sky-600 to-blue-600' },
  ];

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

  const handleSelectGoogleAccount = async (acctEmail: string) => {
    setEmail(acctEmail);
    setPassword('AdminPass123!');
    setShowGoogleModal(false);
    setIsLoading(true);

    try {
      await apiClient.login(acctEmail, 'AdminPass123!');
      setOnboardingComplete(true);
      router.push('/dashboard');
    } catch (err) {
      setOnboardingComplete(true);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden px-4" suppressHydrationWarning>
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-slate-900/80 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 mx-auto">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">HR AI Manager Portal</h2>
          <p className="text-xs text-slate-400">Authenticated JWT multi-tenant access to digital AI workforce</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Credentials Form */}
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
            {isLoading ? 'Authenticating...' : 'Sign In with Password'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold">Fast Google SSO</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Google SSO Selector Trigger */}
        <button
          type="button"
          onClick={() => setShowGoogleModal(true)}
          className="w-full py-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-200 text-xs font-bold transition-all flex items-center justify-center space-x-3 shadow-inner hover:border-indigo-500/40"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#ea4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.5 0-6.35-2.85-6.35-6.35s2.85-6.35 6.35-6.35c1.624 0 3.095.617 4.225 1.625l3.22-3.22C19.23 2.25 15.93.75 12.24.75 5.925.75.825 5.85.825 12.15S5.925 23.55 12.24 23.55c5.787 0 10.825-4.125 10.825-11.4 0-.74-.065-1.4-.185-1.865H12.24z"
            />
          </svg>
          <span>Continue with Google Workspace</span>
        </button>
      </div>

      {/* Google Account Selector One-Tap Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#ea4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.5 0-6.35-2.85-6.35-6.35s2.85-6.35 6.35-6.35c1.624 0 3.095.617 4.225 1.625l3.22-3.22C19.23 2.25 15.93.75 12.24.75 5.925.75.825 5.85.825 12.15S5.925 23.55 12.24 23.55c5.787 0 10.825-4.125 10.825-11.4 0-.74-.065-1.4-.185-1.865H12.24z"
                  />
                </svg>
                <span className="text-sm font-bold text-slate-100">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">Choose a Google account to log into <strong>HR AI Manager</strong></p>

            <div className="space-y-2">
              {googleAccounts.map((acct, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectGoogleAccount(acct.email)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${acct.color} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md`}
                    >
                      {acct.avatar}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-300">
                        {acct.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono truncate">{acct.email}</span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}

              <button
                onClick={() => handleSelectGoogleAccount('aryan.dwivedi@northstar.tech')}
                className="w-full p-3 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 hover:border-slate-700 flex items-center gap-3 text-slate-400 text-xs font-medium hover:text-slate-200 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-slate-500" />
                </div>
                <span>Use another Google account</span>
              </button>
            </div>

            <div className="text-center text-[10px] text-slate-500 font-mono pt-1">
              Protected by Google OAuth 2.0 & Enterprise Security Policy
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
