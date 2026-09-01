'use client';

import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { BarChart3, TrendingUp, Cpu, Zap, Activity, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Analytics & Usage Metrics</h1>
          <p className="text-sm text-slate-400">Detailed token consumption, latency, and cost telemetry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total LLM Tokens', value: '4.2M tokens', detail: '3.1M input / 1.1M output' },
            { label: 'Avg Latency', value: '312ms', detail: 'P99: 840ms' },
            { label: 'Estimated API Cost', value: '$42.18', detail: 'This billing cycle' },
            { label: 'Success Rate', value: '98.6%', detail: '0.04% error rate' },
          ].map((card, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <div className="text-2xl font-extrabold text-slate-100">{card.value}</div>
              <span className="text-[11px] text-slate-500">{card.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
