'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../components/providers/AppContext';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldAlert, 
  UserCheck, 
  Workflow, 
  Lock, 
  ShieldCheck,
  Globe,
  LogOut,
  LogIn
} from 'lucide-react';

interface Article {
  id: string;
  category: string;
  date: string;
  title: string;
  description: string;
  readTime: string;
  artType: 'mesh' | 'ring' | 'nodes' | 'shield';
}

export default function Home() {
  const router = useRouter();
  const { currentUser, setCurrentUser, onboardingComplete, setOnboardingComplete } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showGooglePrompt, setShowGooglePrompt] = useState(!currentUser);

  // Sample research articles matching OpenAI's index format
  const articles: Article[] = [
    {
      id: 'art-1',
      category: 'Orchestration',
      date: 'August 28, 2026',
      title: 'Proving Multi-Agent Safety via Orchestrator Intent Mapping',
      description: 'How intent classification routing prevents agent conflicts and guarantees deterministic execution loops.',
      readTime: '7 min read',
      artType: 'mesh'
    },
    {
      id: 'art-2',
      category: 'Security & Tenancy',
      date: 'August 25, 2026',
      title: 'Verifiable RLS Bounds in Shared SaaS Environments',
      description: 'Formal verification of database row-level security scopes to enforce mathematical isolation between tenants.',
      readTime: '12 min read',
      artType: 'shield'
    },
    {
      id: 'art-3',
      category: 'Human Alignment',
      date: 'August 20, 2026',
      title: 'Designing Human-in-the-Loop Action Centers',
      description: 'A study on risk thresholds and manual approval patterns for high-impact AI transactions.',
      readTime: '9 min read',
      artType: 'ring'
    },
    {
      id: 'art-4',
      category: 'NLP & Agents',
      date: 'August 14, 2026',
      title: 'Structured Prompt Injection Prevention Systems',
      description: 'Implementing token interceptors to capture and neutralize prompt jailbreak vectors in real time.',
      readTime: '6 min read',
      artType: 'nodes'
    }
  ];

  const handleGoogleOneTapLogin = () => {
    // Authenticate user with suggested Google account credentials
    setCurrentUser({
      id: 'usr-google',
      organizationId: 'org-1', // Acme Corp
      email: 'alice.vance@acme.com',
      firstName: 'Alice (Google)',
      lastName: 'Vance',
      role: 'HR_ADMIN',
      status: 'active'
    } as any);
    setOnboardingComplete(true);
    setShowGooglePrompt(false);
    alert('Google credentials verified. Redirecting to Enterprise Dashboard...');
    router.push('/dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null as any);
    setShowGooglePrompt(true);
    alert('Logged out successfully.');
  };

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            article.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Abstract SVG generators to serve as premium "blog art"
  const renderAbstractArt = (type: 'mesh' | 'ring' | 'nodes' | 'shield') => {
    switch (type) {
      case 'mesh':
        return (
          <svg className="w-full h-40 bg-gradient-to-tr from-slate-900 via-cyan-950/20 to-slate-950 p-6" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M10,20 L50,80 L90,20 Z" fill="none" stroke="url(#cyanGrad)" strokeWidth="0.5" />
            <path d="M50,10 L50,90" fill="none" stroke="url(#cyanGrad)" strokeWidth="0.2" />
            <path d="M10,50 L90,50" fill="none" stroke="url(#cyanGrad)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-full h-40 bg-gradient-to-tr from-slate-900 via-indigo-950/20 to-slate-950 p-6" viewBox="0 0 100 100">
            <path d="M50,15 L80,25 L80,55 C80,72 67,88 50,93 C33,88 20,72 20,55 L20,25 Z" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeOpacity="0.4" />
            <circle cx="50" cy="48" r="8" fill="none" stroke="#06b6d4" strokeWidth="0.5" />
          </svg>
        );
      case 'ring':
        return (
          <svg className="w-full h-40 bg-gradient-to-tr from-slate-900 via-violet-950/20 to-slate-950 p-6" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#8b5cf6" strokeWidth="0.3" strokeOpacity="0.4" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeOpacity="0.6" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="#a78bfa" strokeWidth="0.8" />
          </svg>
        );
      case 'nodes':
        return (
          <svg className="w-full h-40 bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-950 p-6" viewBox="0 0 100 100">
            <line x1="20" y1="30" x2="50" y2="50" stroke="#06b6d4" strokeWidth="0.5" />
            <line x1="80" y1="30" x2="50" y2="50" stroke="#6366f1" strokeWidth="0.5" />
            <line x1="50" y1="80" x2="50" y2="50" stroke="#8b5cf6" strokeWidth="0.5" />
            <circle cx="20" cy="30" r="4" fill="#06b6d4" />
            <circle cx="80" cy="30" r="4" fill="#6366f1" />
            <circle cx="50" cy="80" r="4" fill="#8b5cf6" />
            <circle cx="50" cy="50" r="6" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          </svg>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden" suppressHydrationWarning>
      {/* Floating Google Account Suggestion (One Tap Simulator) */}
      {showGooglePrompt && !currentUser && (
        <div className="fixed top-20 right-6 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 z-[99999] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Google Sign-in</span>
            </div>
            <button 
              onClick={() => setShowGooglePrompt(false)} 
              className="text-slate-500 hover:text-slate-300 text-xs px-1"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-slate-350">Sign in to HRFlow AI as:</p>
            <div 
              onClick={handleGoogleOneTapLogin}
              className="flex items-center space-x-3 p-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-xl cursor-pointer transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                AV
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">Alice Vance</p>
                <p className="text-[10px] text-slate-550 truncate">alice.vance@acme.com</p>
              </div>
            </div>
            <button
              onClick={handleGoogleOneTapLogin}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs rounded-lg transition-all"
            >
              Continue as Alice
            </button>
          </div>
        </div>
      )}

      {/* Header bar navigation */}
      <header className="h-16 border-b border-slate-850 px-8 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-md relative z-30">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            HRFlow Research
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-xs text-slate-400 font-medium">
          <Link href="/" className="text-slate-100 hover:text-white">Research</Link>
          <Link href="/onboarding-hr" className="hover:text-white">Onboarding</Link>
          <Link href="/policies" className="hover:text-white">Handbook</Link>
          <Link href="/audit-log" className="hover:text-white">Safety & Logs</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link 
                href="/dashboard" 
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-850 transition-all"
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-slate-400 hover:text-white text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setShowGooglePrompt(true)}
                className="text-slate-400 hover:text-white text-xs font-medium"
              >
                Sign In
              </button>
              <Link 
                href="/login" 
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all flex items-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Enter Portal</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 relative z-20">
        
        {/* Editorial Title Header */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-serif italic text-slate-100 font-light tracking-tight">
            AI Safety & Operational Research
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
            Our papers cover structural tenant isolation, prompt validation sanitizers, and human-in-the-loop audit alignment.
          </p>
        </div>

        {/* Interactive Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 shrink-0">
            {['All', 'Orchestration', 'Security & Tenancy', 'Human Alignment', 'NLP & Agents'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-100 text-slate-950 font-bold' 
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search research..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs outline-none text-slate-200 focus:border-slate-700 transition-all"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map(art => (
              <div 
                key={art.id} 
                className="group p-1 bg-slate-900/40 border border-slate-850 hover:border-slate-750 rounded-2xl transition-all duration-200 flex flex-col shadow-lg overflow-hidden"
              >
                {/* Abstract artwork top section */}
                {renderAbstractArt(art.artType)}

                {/* Card Text Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Category & Date Tag */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{art.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-serif text-slate-100 font-bold group-hover:text-cyan-400 transition-colors leading-tight">
                      {art.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {art.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-850/50">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">{art.readTime}</span>
                    <Link
                      href={currentUser ? '/dashboard' : '/login'}
                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-200 group-hover:text-cyan-400 transition-colors"
                    >
                      <span>Read Paper</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-850 rounded-2xl">
            <p className="text-xs text-slate-500">No research articles match your selected query or filters.</p>
          </div>
        )}

      </main>

      {/* Footer info */}
      <footer className="h-16 border-t border-slate-850 flex items-center justify-center text-[10px] text-slate-600 relative z-20 bg-slate-950">
        HRFlow AI © 2026. Editorial research files are tenant isolated and compliant.
      </footer>
    </div>
  );
}
