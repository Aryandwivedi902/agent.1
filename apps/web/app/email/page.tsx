'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { agentSystem } from '../../lib/agents';
import { Mail, CheckCircle, AlertTriangle, ArrowRight, Bot } from 'lucide-react';

export default function EmailWorkspace() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [emails, setEmails] = useState<any[]>([]);
  const [activeEmail, setActiveEmail] = useState<any | null>(null);
  
  // Drafting state variables
  const [drafting, setDrafting] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const initialEmails = [
    {
      id: 'em-1',
      from: 'sarah.connor@gmail.com',
      fromName: 'Sarah Connor',
      subject: 'Interview Coordination Inquiry',
      body: "Hello, I wanted to follow up on my job application for the Senior Fullstack Engineer position. I am available for a phone screening this week. Let me know when is best.",
      receivedAt: '2026-08-30T10:15:00Z',
      status: 'unresolved'
    },
    {
      id: 'em-2',
      from: 'john.doe@acme.com',
      fromName: 'John Doe',
      subject: 'PTO carryover question',
      body: "Hi Bob, I have some unused vacation days remaining. Can I carry these over into the 2027 calendar year? Please let me know the rule.",
      receivedAt: '2026-08-29T14:30:00Z',
      status: 'unresolved'
    }
  ];

  useEffect(() => {
    setEmails(initialEmails);
    setActiveEmail(initialEmails[0]);
    setAiResponse(null);
    setSuccessMsg('');
  }, [activeOrgId]);

  const handleDraftReply = async () => {
    if (!activeEmail) return;
    setDrafting(true);
    setAiResponse(null);

    try {
      // Simulate Email Agent drafting
      const messageQuery = `Draft email response to ${activeEmail.fromName} (<${activeEmail.from}>) regarding: ${activeEmail.subject}. Context body: ${activeEmail.body}`;
      
      const result = await agentSystem.processRequest(
        activeOrgId,
        currentUser.id,
        currentUser.email,
        currentUser.role,
        messageQuery
      );

      setAiResponse(result);
    } catch (e) {
      console.error(e);
    } finally {
      setDrafting(false);
    }
  };

  const handleQueueApproval = () => {
    if (!aiResponse || !activeEmail) return;
    
    // Trigger approval write (handled already by tool trigger inside agent system if isSend was requested,
    // but since this was a "draft", we manually push it as a send_email HIGH risk action)
    const payload = {
      to: activeEmail.from,
      subject: `RE: ${activeEmail.subject}`,
      body: aiResponse.summary.replace('Here is the email draft prepared for ' + activeEmail.from + ':\n\n**Subject**: Interview Schedule Proposal\n\n**Body**:\n', '')
    };

    db.addApprovalRequest(
      activeOrgId,
      'Email Agent',
      'send_email',
      'HIGH',
      payload,
      `Replying to inbound correspondence: "${activeEmail.subject}"`,
      ['Requires HR manager confirmation prior to dispatch.']
    );

    setSuccessMsg('Draft reply successfully queued in the Approvals Center.');
    setActiveEmail((prev: any) => prev ? { ...prev, status: 'resolved' } : null);
    setEmails((prev: any[]) => prev.map(e => e.id === activeEmail.id ? { ...e, status: 'resolved' } : e));
    setAiResponse(null);
    refreshData();
    
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <Mail className="w-8 h-8 text-cyan-400" />
          <span>Email Workspace</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Classify corporate communications, isolate intent, and coordinate approval-guided drafts.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center space-x-2 p-3.5 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-xl text-sm font-semibold">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Workspace split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Inbox Left Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Operational Inbox</h4>
          <div className="space-y-3">
            {emails.map(mail => (
              <button
                key={mail.id}
                onClick={() => {
                  setActiveEmail(mail);
                  setAiResponse(null);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeEmail?.id === mail.id
                    ? 'bg-slate-900/60 border-cyan-500/80 text-slate-200 shadow-md'
                    : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60 text-slate-400'
                }`}
              >
                <div className="flex justify-between items-start text-xs">
                  <span className="font-bold text-slate-300">{mail.fromName}</span>
                  <span className="text-slate-500">{new Date(mail.receivedAt).toLocaleDateString()}</span>
                </div>
                <h5 className="font-semibold text-slate-200 mt-1 truncate">{mail.subject}</h5>
                <p className="text-[11px] text-slate-500 truncate mt-1.5">{mail.body}</p>
                {mail.status === 'resolved' && (
                  <span className="inline-block mt-3 text-[9px] bg-emerald-950 text-emerald-400 font-bold border border-emerald-900/40 px-2 py-0.5 rounded-full uppercase">
                    QUEUED
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Email Center View */}
        <div className="lg:col-span-2 space-y-6">
          {activeEmail ? (
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
              
              {/* Message Header info */}
              <div className="border-b border-slate-850 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{activeEmail.subject}</h3>
                  <span className="text-xs text-slate-500 block mt-1">
                    From: {activeEmail.fromName} &lt;{activeEmail.from}&gt;
                  </span>
                </div>
                {activeEmail.status === 'unresolved' && (
                  <button
                    onClick={handleDraftReply}
                    disabled={drafting}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 active:scale-95 text-slate-950 text-xs font-bold rounded-xl transition-all inline-flex items-center space-x-1.5 shrink-0"
                  >
                    <Bot className={`w-4 h-4 ${drafting ? 'animate-spin' : ''}`} />
                    <span>{drafting ? 'Analyzing Email...' : 'AI Draft Reply'}</span>
                  </button>
                )}
              </div>

              {/* Message Content */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 text-sm text-slate-300 leading-relaxed font-sans min-h-[120px]">
                {activeEmail.body}
              </div>

              {/* AI response result container */}
              {aiResponse && (
                <div className="space-y-4 pt-4 border-t border-slate-850">
                  <div className="flex items-center space-x-2 text-cyan-400 text-sm font-bold">
                    <Bot className="w-5 h-5" />
                    <span>Email Agent Draft Suggestion</span>
                  </div>

                  <div className="p-5 bg-slate-950 border border-slate-850 rounded-xl text-xs space-y-3">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-300">{aiResponse.summary}</div>
                    
                    {/* warnings panel */}
                    {aiResponse.warnings.length > 0 && (
                      <div className="p-3 bg-amber-950/20 border border-amber-900/30 text-amber-300 rounded-lg flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Warning: {aiResponse.warnings[0]}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleQueueApproval}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all inline-flex items-center space-x-1.5"
                  >
                    <span>Queue in Approval Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/10 border border-slate-850 rounded-2xl text-slate-500 text-sm">
              Select an email thread from the inbox to display thread metadata.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
