'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { Award, CheckCircle, Info, RefreshCw } from 'lucide-react';

export default function OnboardingHr() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<any | null>(null);

  useEffect(() => {
    const list = db.getOnboarding(activeOrgId);
    setWorkflows(list);
    setActiveWorkflow(list[0] || null);
  }, [activeOrgId]);

  const handleToggleTask = (taskId: string) => {
    if (!activeWorkflow) return;
    db.toggleOnboardingTask(activeOrgId, activeWorkflow.id, taskId, currentUser.email);
    
    // Reload state
    const list = db.getOnboarding(activeOrgId);
    setWorkflows(list);
    setActiveWorkflow(list.find(o => o.id === activeWorkflow.id) || null);
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <Award className="w-8 h-8 text-cyan-400" />
          <span>Onboarding Progress</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Track employee onboarding workflow tasks and compliance document uploads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Workflows List Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Employees Onboarding</h4>
          <div className="space-y-3">
            {workflows.map(flow => (
              <button
                key={flow.id}
                onClick={() => setActiveWorkflow(flow)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeWorkflow?.id === flow.id
                    ? 'bg-slate-900/60 border-cyan-500/80 text-slate-200 shadow-md'
                    : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60 text-slate-400'
                }`}
              >
                <div className="flex justify-between items-start text-xs">
                  <span className="font-bold text-slate-350">{flow.employeeName}</span>
                  <span className="font-bold text-cyan-400">{flow.progress}%</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">{flow.jobTitle}</div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-3 overflow-hidden border border-slate-850">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${flow.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Workflow Tasks checklist */}
        <div className="lg:col-span-2 space-y-6">
          {activeWorkflow ? (
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
              
              <div className="border-b border-slate-850 pb-4">
                <h3 className="text-lg font-bold text-slate-200">{activeWorkflow.employeeName}</h3>
                <span className="text-xs text-slate-500 mt-1 block">
                  Workflow Track: {activeWorkflow.jobTitle} Onboarding Checklist ({activeWorkflow.progress}% Complete)
                </span>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Checklist Verification Tasks</span>
                <div className="space-y-2">
                  {activeWorkflow.tasks.map((task: any) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-4 bg-slate-950/60 hover:bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        task.status === 'completed' ? 'border-emerald-950 bg-emerald-950/5' : 'border-slate-850'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 text-xs">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => {}} // toggled on container div click
                          className="w-4 h-4 accent-cyan-500 bg-slate-900 border-slate-800 cursor-pointer"
                        />
                        <div>
                          <span className={`font-semibold text-slate-350 block ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                            {task.title}
                          </span>
                          {task.requiredDoc && (
                            <span className="text-[9px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-850 mt-1 inline-block">
                              Doc Required: {task.requiredDoc}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                        task.assignedTo === 'hr' ? 'bg-cyan-950 text-cyan-400' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {task.assignedTo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/10 border border-slate-850 rounded-2xl text-slate-500 text-sm">
              Select an employee checklist tracker to view progress.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
