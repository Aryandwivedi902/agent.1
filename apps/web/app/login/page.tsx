'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/providers/AppContext';
import { Sparkles, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setOnboardingComplete } = useApp();
  const [email, setEmail] = useState('alice.vance@acme.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate active validation check and route
    setOnboardingComplete(true);
    router.push('/dashboard');
  };

  const handleGoogleLogin = () => {
    // Fill credentials and log in to show quick entry suggestion flow
    setEmail('alice.vance@acme.com');
    setPassword('password123');
    alert('Authenticating with Google Account credentials. Redirecting to workspace...');
    setOnboardingComplete(true);
    router.push('/dashboard');
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden px-4" suppressHydrationWarning>
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-md shadow-2xl space-y-6 relative z-10">
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md mx-auto">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Enterprise Access Portal</h2>
          <p className="text-xs text-slate-500">Sign in to coordinate multi-agent HR workflows</p>
        </div>

        {/* Standard credentials login form with autoComplete triggers */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Email Address</label>
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5">
              <Mail className="w-4 h-4 text-slate-650 shrink-0" />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-transparent flex-1 text-xs outline-none text-slate-200"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Password</label>
            <div className="flex items-center space-x-3 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5">
              <Lock className="w-4 h-4 text-slate-650 shrink-0" />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-transparent flex-1 text-xs outline-none text-slate-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            Access Portal
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-850"></div>
          <span className="flex-shrink mx-4 text-slate-600 text-[10px] uppercase font-bold">Or connect via SSO</span>
          <div className="flex-grow border-t border-slate-850"></div>
        </div>

        {/* Google Authentication suggest trigger */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 text-xs font-bold transition-all flex items-center justify-center space-x-2.5"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#ea4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.5 0-6.35-2.85-6.35-6.35s2.85-6.35 6.35-6.35c1.624 0 3.095.617 4.225 1.625l3.22-3.22C19.23 2.25 15.93.75 12.24.75 5.925.75.825 5.85.825 12.15S5.925 23.55 12.24 23.55c5.787 0 10.825-4.125 10.825-11.4 0-.74-.065-1.4-.185-1.865H12.24z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="text-center text-[10px] text-slate-650">
          Enforced multi-tenant isolation. All access sequences are audited.
        </div>

      </div>
    </div>
  );
}
