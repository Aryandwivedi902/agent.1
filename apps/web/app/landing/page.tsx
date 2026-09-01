'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  Play,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
  Cpu,
  Lock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card3D } from '../../components/ui/Card3D';

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Top Marketing Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-white to-slate-200 bg-clip-text text-transparent">
            HR AI MANAGER
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Start Free
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enterprise Multi-Agent HR Operating System</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight">
          Your Digital AI Workforce for{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">
            Modern HR Operations
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          One intelligent HR manager. Specialized AI agents. Automated workflows. Human control when it matters.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/dashboard">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Start Free Trial
            </Button>
          </Link>
          <Link href="/ai-manager">
            <Button variant="outline" size="lg" icon={<Play className="w-4 h-4 fill-current text-indigo-400" />}>
              Watch How It Works
            </Button>
          </Link>
        </div>

        {/* 3D Orchestration Diagram Visualizer */}
        <div className="pt-12 max-w-5xl mx-auto">
          <Card3D glowColor="indigo" className="p-8 md:p-12 relative overflow-hidden">
            {/* Live System Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-800/80 text-left">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Infrastructure Topology</span>
                <h3 className="text-lg font-bold text-slate-100">HR AI Manager Orchestration Architecture</h3>
              </div>

              {/* Status Panel */}
              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">6 Agents Active</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300">18 Tasks Running</span>
                <span className="text-slate-600">|</span>
                <span className="text-indigo-400 font-semibold">99.2% Availability</span>
              </div>
            </div>

            {/* Visual 3D Tree Diagram */}
            <div className="py-12 flex flex-col items-center justify-center space-y-10 relative">
              {/* Top Infrastructure Node */}
              <div className="px-4 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                LLM Infrastructure (OpenAI / Anthropic / Custom RAG)
              </div>

              <div className="w-0.5 h-6 bg-indigo-500/50" />

              {/* Central HR AI Manager Node */}
              <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-lg shadow-2xl shadow-indigo-500/30 flex items-center gap-3 border border-indigo-400/40 transform hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 animate-spin" />
                <span>HR AI MANAGER (Central Command)</span>
              </div>

              <div className="w-0.5 h-8 bg-indigo-500/50" />

              {/* 6 Specialized Agent Branch Nodes */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full pt-4">
                {[
                  { name: 'Email Agent', emoji: '✉️', role: 'Comms', color: 'indigo' },
                  { name: 'Policy Agent', emoji: '📚', role: 'Compliance', color: 'emerald' },
                  { name: 'Request Agent', emoji: '💬', role: 'Helpdesk', color: 'sky' },
                  { name: 'Recruitment Agent', emoji: '🎯', role: 'Sourcing', color: 'amber' },
                  { name: 'Onboarding Agent', emoji: '📋', role: 'Ops', color: 'purple' },
                  { name: 'Analytics Agent', emoji: '📊', role: 'Audit', color: 'emerald' },
                ].map((agent, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-2 hover:border-indigo-500/50 transition-colors shadow-lg"
                  >
                    <span className="text-2xl">{agent.emoji}</span>
                    <span className="text-xs font-bold text-slate-100">{agent.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{agent.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>
        </div>
      </section>
    </div>
  );
}
