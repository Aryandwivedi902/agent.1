'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { Users, Info, ShieldCheck, CheckCircle2, XCircle, ArrowRight, UserPlus } from 'lucide-react';

export default function RecruitmentWorkspace() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<any | null>(null);

  // Add Candidate Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [score, setScore] = useState(80);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const list = db.getCandidates(activeOrgId);
    setCandidates(list);
    setActiveCandidate(list[0] || null);
  }, [activeOrgId]);

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;

    const newCan = db.addCandidate(
      activeOrgId,
      {
        recruitmentJobId: 'job-1',
        jobTitle: 'Senior Fullstack Engineer',
        firstName,
        lastName,
        email,
        status: 'screening',
        matchScore: score,
        matchedCriteria: ['React & TypeScript expert'],
        missingCriteria: ['5+ years Experience (candidate has 3 years)'],
        notes
      },
      currentUser.email
    );

    setCandidates(db.getCandidates(activeOrgId));
    setActiveCandidate(newCan);
    setFirstName('');
    setLastName('');
    setEmail('');
    setNotes('');
    refreshData();
  };

  const handleUpdateStatus = (status: any) => {
    if (!activeCandidate) return;
    db.updateCandidateStatus(activeOrgId, activeCandidate.id, status, currentUser.email);
    
    const list = db.getCandidates(activeOrgId);
    setCandidates(list);
    setActiveCandidate(list.find(c => c.id === activeCandidate.id) || null);
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <Users className="w-8 h-8 text-cyan-400" />
          <span>Recruitment Workspace</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Assess candidates against requirements using the decision-support Recruitment Agent.
        </p>
      </div>

      {/* Safety Notice (Step 11 requirement) */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed text-slate-400">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 block mb-1">Recruitment Safety Safeguard Notice:</strong>
          HRFlow AI utilizes machine learning evaluation matrices for job suitability screening support. 
          The agent does **NOT** make autonomous hiring, compensation, or rejection decisions. 
          All pipeline Stage shifts and interview choices must be initiated and reviewed by an authorized human recruiter.
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Candidate List Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Applicant Directory</h4>
          <div className="space-y-3">
            {candidates.map(can => (
              <button
                key={can.id}
                onClick={() => setActiveCandidate(can)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeCandidate?.id === can.id
                    ? 'bg-slate-900/60 border-cyan-500/80 text-slate-200'
                    : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60 text-slate-400'
                }`}
              >
                <div className="flex justify-between items-start text-xs">
                  <span className="font-bold text-slate-300">{can.firstName} {can.lastName}</span>
                  <span className="font-bold text-cyan-400">{can.matchScore}% Match</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{can.jobTitle}</div>
                <div className="flex justify-between items-center mt-3 text-[10px]">
                  <span className="text-slate-500">{can.email}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850 uppercase text-[9px] font-bold">
                    {can.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Candidate Details & Evaluation Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {activeCandidate ? (
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
              
              {/* Header and status toggles */}
              <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{activeCandidate.firstName} {activeCandidate.lastName}</h3>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Position Applied: {activeCandidate.jobTitle}
                  </span>
                </div>

                {/* Manual Status triggers */}
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus('interview')}
                    className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold rounded-lg transition-all border border-slate-700/50"
                  >
                    Invite Interview
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('hired')}
                    className="px-3 py-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900/40 text-xs font-bold rounded-lg transition-all border border-emerald-900/30"
                  >
                    Approve Offer
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('rejected')}
                    className="px-3 py-1.5 bg-rose-950 text-rose-400 hover:bg-rose-900/40 text-xs font-bold rounded-lg transition-all border border-rose-900/30"
                  >
                    Reject Candidate
                  </button>
                </div>
              </div>

              {/* Assessment Matrix */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Screening Criteria Matrix</span>
                <div className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-3 font-semibold border-b border-slate-850">
                    <span>Target Qualification</span>
                    <span>Result</span>
                    <span>Evidence Source</span>
                  </div>
                  
                  {activeCandidate.matchedCriteria.map((crit: string, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 p-3 border-b border-slate-850/60 items-center">
                      <span className="text-slate-300">{crit}</span>
                      <span className="flex items-center text-emerald-400 font-semibold space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Matched</span>
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">resume_extracted_notes.pdf</span>
                    </div>
                  ))}

                  {activeCandidate.missingCriteria.map((crit: string, idx: number) => (
                    <div key={idx} className="grid grid-cols-3 gap-2 p-3 items-center">
                      <span className="text-slate-350">{crit}</span>
                      <span className="flex items-center text-rose-400 font-semibold space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Missing</span>
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">resume_extracted_notes.pdf</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Recruiter Profile Notes</span>
                <p className="text-slate-300 text-xs leading-relaxed font-sans p-4 bg-slate-950 border border-slate-850 rounded-xl">
                  {activeCandidate.notes || 'No candidate assessment comments compiled.'}
                </p>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/10 border border-slate-850 rounded-2xl text-slate-500 text-sm">
              Select an applicant profile to print screening details.
            </div>
          )}

          {/* Submission Form at bottom */}
          <form onSubmit={handleCreateCandidate} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Simulate Candidate Entry</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="e.g. Connor"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. john@email.com"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Screening Suitability Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Evaluation Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Core skills summary..."
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
            >
              Add Applicant
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
