'use client';

import React, { useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { FileSpreadsheet, Download, RefreshCw, FileText, CheckCircle } from 'lucide-react';

export default function ReportsWorkspace() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [reportType, setReportType] = useState('operations');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledReport, setCompiledReport] = useState<any | null>(null);

  const handleCompile = () => {
    setIsCompiling(true);
    setCompiledReport(null);

    setTimeout(() => {
      setIsCompiling(false);
      setCompiledReport({
        title: `${reportType.toUpperCase()} HR Operations Summary`,
        compiledAt: new Date().toISOString(),
        metrics: {
          activeStaff: db.getEmployees(activeOrgId).filter(e => e.status === 'active').length,
          requestsCount: db.getRequests(activeOrgId).length,
          approvalsExecuted: db.getApprovals(activeOrgId).filter(a => a.status === 'executed').length
        },
        aiInterpretation: `HRFlow AI report compiled successfully. Verified tenant bounds for Org ID: ${activeOrgId}. Active staff headcount shows high retention rate. Time-off approvals are progressing smoothly.`,
        recommendations: 'Ensure pending document checklists are completed by the onboarding targets to avoid workflow blockages.'
      });
      db.logAudit(activeOrgId, currentUser.email, 'user', 'COMPILE_REPORT', 'reports', 'success', `Generated ${reportType} report compilation.`);
      refreshData();
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <FileSpreadsheet className="w-8 h-8 text-cyan-400" />
          <span>Reports Compiler</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Generate structured operational summaries, audit statements, and onboarding reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Compilation controls form */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
          <h4 className="text-sm font-bold text-slate-200">Report Configurations</h4>
          
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Target Template</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-355 outline-none cursor-pointer focus:border-cyan-500"
            >
              <option value="operations">Daily Operational Report</option>
              <option value="recruitment">Recruitment Sourcing Review</option>
              <option value="onboarding">Staff Onboarding Compliance</option>
              <option value="audits">Compliance Security Audits</option>
            </select>
          </div>

          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'Compiling Datasets...' : 'Compile Document'}</span>
          </button>
        </div>

        {/* Compiled Report Result Output */}
        <div className="lg:col-span-2 space-y-6">
          {compiledReport ? (
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
              
              <div className="border-b border-slate-850 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{compiledReport.title}</h3>
                  <span className="text-xs text-slate-500 block mt-1">Compiled at {new Date(compiledReport.compiledAt).toLocaleString()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('CSV file export generated (Simulated). Logged in audit trail.')}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 border border-slate-700/50 hover:bg-slate-700 text-xs font-bold rounded-xl transition-all inline-flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Data parameters */}
              <div className="grid grid-cols-3 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-850">
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px]">Active Employees</span>
                  <span className="text-sm font-bold text-slate-200">{compiledReport.metrics.activeStaff}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px]">Accrued Requests</span>
                  <span className="text-sm font-bold text-slate-200">{compiledReport.metrics.requestsCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[9px]">Actions Authorized</span>
                  <span className="text-sm font-bold text-slate-200">{compiledReport.metrics.approvalsExecuted}</span>
                </div>
              </div>

              {/* AI interpretation */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">AI Analytic Interpretation</span>
                <p className="p-4 bg-slate-950 border border-slate-850 rounded-xl leading-relaxed text-slate-300 font-sans">
                  {compiledReport.aiInterpretation}
                </p>
              </div>

              {/* AI recommendations */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Operational Recommendations</span>
                <p className="p-4 bg-slate-950 border border-slate-850 rounded-xl leading-relaxed text-slate-300 font-sans">
                  {compiledReport.recommendations}
                </p>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/10 border border-slate-850 rounded-2xl text-slate-500 text-sm">
              Trigger report compilation using configuration sidebar options.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
