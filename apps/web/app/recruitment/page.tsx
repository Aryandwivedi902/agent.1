'use client';

import React from 'react';
import { HRShell } from '../../components/layout/HRShell';
import { Card3D } from '../../components/ui/Card3D';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Users, Sparkles, Search, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { CandidateProfile } from '../../types/hr-ai';

export default function RecruitmentPage() {
  const candidates: CandidateProfile[] = [
    { id: 'c-1', name: 'Sarah Connor', appliedRole: 'Sr. Backend Engineer', aiMatchScore: 94, stage: 'Interviewing', experienceYears: 7, skills: ['Node.js', 'React', 'Python', 'PostgreSQL'], summary: '7+ yrs building scalable cloud microservices. Strong system architecture.', appliedDate: 'Yesterday', email: 'sarah.connor@gmail.com' },
    { id: 'c-2', name: 'David Miller', appliedRole: 'Sr. Backend Engineer', aiMatchScore: 91, stage: 'Screened', experienceYears: 6, skills: ['TypeScript', 'Node.js', 'Redis', 'Docker'], summary: 'Distributed systems engineer with fintech background.', appliedDate: '2 days ago', email: 'david.m@outlook.com' },
    { id: 'c-3', name: 'Elena Rostova', appliedRole: 'HR Operations Manager', aiMatchScore: 89, stage: 'Shortlisted', experienceYears: 5, skills: ['Workday', 'BambooHR', 'Talent Ops'], summary: 'Enterprise HR ops lead specializing in automated onboarding.', appliedDate: '3 days ago', email: 'elena.r@tech.co' },
    { id: 'c-4', name: 'Marcus Vance', appliedRole: 'Lead AI Engineer', aiMatchScore: 96, stage: 'Offered', experienceYears: 8, skills: ['LLMs', 'PyTorch', 'Vector Search', 'LangChain'], summary: 'Built multi-agent frameworks and fine-tuned domain models.', appliedDate: 'Last week', email: 'marcus.v@ai.org' },
  ];

  return (
    <HRShell>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" />
              <span>Talent Acquisition & Candidate Screening Desk</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Recruitment Agent parses resumes, checks salary bands, scores qualifications, and prepares shortlists
            </p>
          </div>
        </div>

        {/* Candidate Table */}
        <div className="border border-slate-800 bg-slate-900/60 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="p-4 font-semibold">Candidate Name</th>
                <th className="p-4 font-semibold">Position</th>
                <th className="p-4 font-semibold">AI Match Score</th>
                <th className="p-4 font-semibold">Stage</th>
                <th className="p-4 font-semibold">Experience</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {candidates.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-100 text-sm">{c.name}</span>
                      <span className="text-slate-400 text-[11px] font-mono">{c.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-200 font-medium">{c.appliedRole}</td>
                  <td className="p-4 font-mono font-bold text-indigo-400">
                    <Badge variant={c.aiMatchScore >= 90 ? 'success' : 'purple'}>
                      <Sparkles className="w-3 h-3 mr-1" /> {c.aiMatchScore}% Match
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="info">{c.stage.toUpperCase()}</Badge>
                  </td>
                  <td className="p-4 text-slate-300 font-mono">{c.experienceYears} yrs</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="outline" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
                        Schedule
                      </Button>
                      <Button variant="primary" size="sm" icon={<Mail className="w-3.5 h-3.5" />}>
                        Invite
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRShell>
  );
}
