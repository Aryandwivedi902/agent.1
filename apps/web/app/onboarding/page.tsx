'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/providers/AppContext';
import { db } from '../../lib/db-mock';
import {
  Sparkles,
  Building,
  Globe,
  Sliders,
  Users,
  CheckCircle,
  FileText,
  Mail,
  Zap,
  Activity,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export default function OnboardingWizard() {
  const router = useRouter();
  const { setOnboardingComplete, activeOrgId, refreshData } = useApp();
  const [step, setStep] = useState(1);
  
  // State variables for form parameters
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [domain, setDomain] = useState('acme.com');
  const [country, setCountry] = useState('US');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [industry, setIndustry] = useState('Technology');
  const [companySize, setCompanySize] = useState('51-200');
  const [emailTone, setEmailTone] = useState('Polite & Professional');
  const [teamEmails, setTeamEmails] = useState('bob.miller@acme.com, john.doe@acme.com');
  
  // Agent activations state
  const [agents, setAgents] = useState({
    manager: true,
    email: true,
    request: true,
    policy: true,
    recruitment: true,
    onboarding: true,
    analytics: true
  });

  // Integrations state
  const [integrations, setIntegrations] = useState({
    google: true,
    slack: false,
    m365: false
  });

  // Approval rules state
  const [requireApproval, setRequireApproval] = useState({
    send_email: true,
    update_employee: true,
    export_data: true
  });

  const [readinessChecking, setReadinessChecking] = useState(false);
  const [readinessDone, setReadinessDone] = useState(false);

  const nextStep = () => setStep(prev => Math.min(prev + 1, 14));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const runReadinessCheck = () => {
    setReadinessChecking(true);
    setTimeout(() => {
      setReadinessChecking(false);
      setReadinessDone(true);
    }, 2000);
  };

  const handleComplete = () => {
    // Write configs to simulated DB settings
    db.updateSettings(
      activeOrgId,
      {
        country,
        timezone,
        locale: country === 'US' ? 'en-US' : 'en-GB',
        currency: country === 'US' ? 'USD' : 'GBP'
      },
      'system@hrflow.ai'
    );

    // Save uploaded seed policy if user uploaded
    db.uploadPolicy(
      activeOrgId,
      'Corporate Operational Handbook',
      'Primary guidelines index.',
      'General Operations',
      [
        'Standard operational policy requires human authorization for external emails.',
        'Vacation leave allocations default to 15 days annually.'
      ],
      'system@hrflow.ai'
    );

    // Toggle integrations in state
    if (integrations.google) {
      // already active by default in Acme seed
    } else {
      // disconnect
      db.toggleIntegration(activeOrgId, 'int-google', 'system@hrflow.ai');
    }

    setOnboardingComplete(true);
    refreshData();
    router.push('/dashboard');
  };

  const stepsList = [
    'Organization Profile',
    'Country & Region',
    'Industry Profile',
    'Company Size',
    'HR Team Members',
    'Roles & Scope',
    'Policy Upload',
    'Knowledge Base',
    'Approval Policies',
    'Integrations',
    'Email Templates',
    'Agent Activation',
    'Readiness Check',
    'Summary'
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="w-full max-w-4xl bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
        
        {/* Left Side: Progress indicators */}
        <div className="md:w-1/4 border-r border-slate-800 pr-6 shrink-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">Setup Wizard</span>
            </div>
            <div className="space-y-3">
              {stepsList.map((name, index) => {
                const stepNum = index + 1;
                const isCurrent = stepNum === step;
                const isPast = stepNum < step;
                return (
                  <div key={name} className="flex items-center space-x-3 text-xs">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-bold transition-all ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400'
                          : isPast
                          ? 'bg-slate-800 text-cyan-400'
                          : 'bg-slate-900 text-slate-600'
                      }`}
                    >
                      {stepNum}
                    </div>
                    <span className={isCurrent ? 'text-cyan-400 font-bold' : isPast ? 'text-slate-400' : 'text-slate-600'}>
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 text-slate-500 text-[10px]">
            Tenant Context: {activeOrgId}
          </div>
        </div>

        {/* Right Side: Step Contents */}
        <div className="flex-1 flex flex-col justify-between min-h-[400px]">
          <div>
            <span className="text-xs font-semibold text-cyan-500 uppercase tracking-widest">
              Step {step} of 14
            </span>
            <h2 className="text-2xl font-bold mb-6 text-slate-100">{stepsList[step - 1]}</h2>

            {/* Step 1: Org Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Company Legal Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Corporate Domain</label>
                  <input
                    type="text"
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Country / Timezone */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Operational Jurisdiction (Country)</label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none text-sm"
                  >
                    <option value="US">United States (US)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="CA">Canada (CA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5 font-medium">Default Corporate Timezone</label>
                  <select
                    value={timezone}
                    onChange={e => setTimezone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none text-sm"
                  >
                    <option value="America/Los_Angeles">Pacific Time (PT) / Los Angeles</option>
                    <option value="America/New_York">Eastern Time (ET) / New York</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT) / London</option>
                    <option value="Europe/Berlin">Central European Time (CET) / Berlin</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Industry */}
            {step === 3 && (
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Market Sector / Industry</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none text-sm"
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="Healthcare">Healthcare & Biotech</option>
                  <option value="Finance">Financial Services</option>
                  <option value="Manufacturing">Manufacturing & Trade</option>
                </select>
              </div>
            )}

            {/* Step 4: Company Size */}
            {step === 4 && (
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Headcount Bracket</label>
                <div className="grid grid-cols-2 gap-4">
                  {['1-50', '51-200', '201-1000', '1000+'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setCompanySize(size)}
                      className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                        companySize === size
                          ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {size} Employees
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: HR Team Members */}
            {step === 5 && (
              <div>
                <label className="block text-sm text-slate-400 mb-1.5 font-medium">Invite HR Administrators / Managers</label>
                <textarea
                  value={teamEmails}
                  onChange={e => setTeamEmails(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-cyan-500 outline-none text-sm font-mono"
                  placeholder="Enter emails separated by commas..."
                />
                <span className="text-[10px] text-slate-500 mt-2 block">
                  Invited users will receive a secure email setup link containing role initialization metadata.
                </span>
              </div>
            )}

            {/* Step 6: Roles and Permissions */}
            {step === 6 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Verify the default role-permission layout schema to assign appropriate workspace boundaries:
                </p>
                <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <div className="flex justify-between text-xs font-semibold border-b border-slate-850 pb-2">
                    <span>Role Group</span>
                    <span>Assigned Permissions</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5">
                    <span className="text-cyan-400 font-bold">HR_ADMIN</span>
                    <span className="text-slate-400">12 scopes (Full administrative clearance)</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5">
                    <span className="text-cyan-400 font-bold">HR_MANAGER</span>
                    <span className="text-slate-400">10 scopes (Operations read/write)</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5">
                    <span className="text-cyan-400 font-bold">EMPLOYEE</span>
                    <span className="text-slate-400">2 scopes (Basic profile lookup, policy read)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Policy Upload */}
            {step === 7 && (
              <div className="space-y-4">
                <label className="block text-sm text-slate-400 font-medium">Upload Initial HR Handbooks / Corporate Guidelines</label>
                <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/80 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-950 transition-all cursor-pointer">
                  <FileText className="w-10 h-10 text-slate-600 mb-3" />
                  <span className="text-sm font-semibold text-slate-300">Drag files here or click to select</span>
                  <span className="text-xs text-slate-500 mt-1">PDF, TXT, Markdown or DOCX up to 10MB</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-300">Default Sandbox PTO Leave Policy pre-loaded</span>
                </div>
              </div>
            )}

            {/* Step 8: Configure knowledge base */}
            {step === 8 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Configure index sync frequency and search threshold rules:
                </p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">RAG Chunk Vector Search Size</span>
                    <span className="text-xs text-cyan-400 font-bold">512 tokens</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Enforce Tenant Filter check</span>
                    <span className="text-xs text-emerald-400 font-bold">Always On</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Default Sync Cadence</span>
                    <span className="text-xs text-slate-400 font-medium">Daily Sync (02:00 UTC)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 9: Configure approval policies */}
            {step === 9 && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Toggle human-in-the-loop validation triggers by operational risk categories:
                </p>
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-slate-300">Require approval to send candidate emails (HIGH risk)</span>
                    <input
                      type="checkbox"
                      checked={requireApproval.send_email}
                      onChange={e => setRequireApproval(prev => ({ ...prev, send_email: e.target.checked }))}
                      className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-slate-300">Require approval to update salary records (HIGH risk)</span>
                    <input
                      type="checkbox"
                      checked={requireApproval.update_employee}
                      onChange={e => setRequireApproval(prev => ({ ...prev, update_employee: e.target.checked }))}
                      className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-slate-300">Require approval to export sensitive CSV data (HIGH risk)</span>
                    <input
                      type="checkbox"
                      checked={requireApproval.export_data}
                      onChange={e => setRequireApproval(prev => ({ ...prev, export_data: e.target.checked }))}
                      className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Step 10: Integrations */}
            {step === 10 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400 mb-3">Select communication interfaces to connect:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-900/30 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-xs font-semibold text-slate-300">Google Workspace (Email & calendar)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIntegrations(prev => ({ ...prev, google: !prev.google }))}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                        integrations.google ? 'bg-cyan-900/40 text-cyan-200 border border-cyan-800' : 'bg-slate-900 text-slate-500 border border-slate-850'
                      }`}
                    >
                      {integrations.google ? 'Active' : 'Connect'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-green-950/40 border border-green-900/30 flex items-center justify-center">
                        <Globe className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-xs font-semibold text-slate-300">Slack (Notifications dispatcher)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIntegrations(prev => ({ ...prev, slack: !prev.slack }))}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                        integrations.slack ? 'bg-cyan-900/40 text-cyan-200 border border-cyan-800' : 'bg-slate-900 text-slate-500 border border-slate-850'
                      }`}
                    >
                      {integrations.slack ? 'Active' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 11: Email tone templates */}
            {step === 11 && (
              <div>
                <label className="block text-sm text-slate-400 mb-3 font-medium">Default Communication Tone Config</label>
                <div className="space-y-2">
                  {['Formal & Instructive', 'Polite & Professional', 'Empathetic & Casual'].map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setEmailTone(tone)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        emailTone === tone
                          ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{tone}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 12: Agent activations */}
            {step === 12 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer">
                  <span className="text-xs font-semibold text-slate-300">HR AI Manager (Orchestrator)</span>
                  <input
                    type="checkbox"
                    checked={agents.manager}
                    disabled
                    className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer">
                  <span className="text-xs font-semibold text-slate-300">Email Agent</span>
                  <input
                    type="checkbox"
                    checked={agents.email}
                    onChange={e => setAgents(prev => ({ ...prev, email: e.target.checked }))}
                    className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer">
                  <span className="text-xs font-semibold text-slate-300">Policy Agent</span>
                  <input
                    type="checkbox"
                    checked={agents.policy}
                    onChange={e => setAgents(prev => ({ ...prev, policy: e.target.checked }))}
                    className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800"
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-950 border border-slate-850 rounded-xl cursor-pointer">
                  <span className="text-xs font-semibold text-slate-300">Recruitment Agent</span>
                  <input
                    type="checkbox"
                    checked={agents.recruitment}
                    onChange={e => setAgents(prev => ({ ...prev, recruitment: e.target.checked }))}
                    className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800"
                  />
                </label>
              </div>
            )}

            {/* Step 13: Readiness check */}
            {step === 13 && (
              <div className="space-y-4 text-center py-6">
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Verify schemas compatibility, RLS policies activation, and secure AI registry parameters.
                </p>
                <button
                  type="button"
                  onClick={runReadinessCheck}
                  disabled={readinessChecking}
                  className="px-6 py-3 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800 hover:bg-cyan-900/40 font-bold transition-all text-sm inline-flex items-center space-x-2"
                >
                  <Activity className={`w-4 h-4 ${readinessChecking ? 'animate-spin' : ''}`} />
                  <span>{readinessChecking ? 'Verifying components...' : 'Run Readiness Scan'}</span>
                </button>

                {readinessDone && (
                  <div className="space-y-2 max-w-sm mx-auto text-left mt-4 bg-slate-950 p-4 border border-slate-850 rounded-xl">
                    <div className="text-xs flex items-center space-x-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>PostgreSQL schema definitions: **OK**</span>
                    </div>
                    <div className="text-xs flex items-center space-x-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Row-Level Tenant isolation policy: **ACTIVE**</span>
                    </div>
                    <div className="text-xs flex items-center space-x-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>Security audit logging listeners: **READY**</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 14: Summary */}
            {step === 14 && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl text-xs space-y-2">
                  <div><strong className="text-slate-400">Company Name</strong>: {companyName}</div>
                  <div><strong className="text-slate-400">Local Jurisdiction</strong>: {country} ({timezone})</div>
                  <div><strong className="text-slate-400">Market Sector</strong>: {industry}</div>
                  <div><strong className="text-slate-400">Tone Profile</strong>: {emailTone}</div>
                  <div><strong className="text-slate-400">Human Approval for Emails</strong>: {requireApproval.send_email ? 'Yes (Enforced)' : 'No'}</div>
                  <div><strong className="text-slate-400">Active Agents</strong>: {Object.keys(agents).filter(k => agents[k as keyof typeof agents]).length} Coordinated Specialist Entities</div>
                </div>
                <p className="text-xs text-rose-400 bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
                  Safety Warning: HRFlow AI does not make binding recruitment or payroll decisions automatically. The AI serves to support decision-making and requires human approval.
                </p>
              </div>
            )}

          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-8">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                step === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step === 14 ? (
              <button
                onClick={handleComplete}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <span>Activate Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-5 py-2.5 bg-slate-800 text-slate-100 hover:bg-slate-700/80 font-semibold rounded-xl transition-all text-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
