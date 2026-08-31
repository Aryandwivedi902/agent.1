'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { BarChart3, TrendingUp, DollarSign, Users, Award, ShieldAlert } from 'lucide-react';

export default function AnalyticsDashboard() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    departments: [] as string[],
    payrollSum: 0,
    avgAccrued: 0
  });

  const [hasPermission, setHasPermission] = useState(true);

  useEffect(() => {
    // RBAC validation for analytics
    if (
      currentUser.role !== 'HR_ADMIN' && 
      currentUser.role !== 'ORGANIZATION_ADMIN' && 
      currentUser.role !== 'AUDITOR'
    ) {
      setHasPermission(false);
      db.logAudit(activeOrgId, currentUser.email, 'user', 'ANALYTICS_DENIED', 'analytics', 'denied', 'Blocked analytics dashboard access due to insufficient RBAC scopes');
      return;
    }

    setHasPermission(true);
    const employees = db.getEmployees(activeOrgId);
    const depts = Array.from(new Set(employees.map(e => e.department)));
    const total = employees.length;
    const active = employees.filter(e => e.status === 'active').length;

    // Simulate payroll sum
    const payroll = employees.reduce((acc, emp) => {
      const salVal = parseInt(emp.salary.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + salVal;
    }, 0);

    setStats({
      total,
      active,
      departments: depts,
      payrollSum: payroll,
      avgAccrued: 12.5
    });

    db.logAudit(activeOrgId, currentUser.email, 'user', 'ACCESS_ANALYTICS', 'analytics', 'success', 'Accessed corporate analytics overview dashboard');
    refreshData();
  }, [activeOrgId, currentUser]);

  if (!hasPermission) {
    return (
      <div className="p-8 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-2xl max-w-xl mx-auto space-y-3">
        <div className="flex items-center space-x-2 text-rose-400 font-bold">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <span>Access Denied — Insufficient Permissions</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          Your current user role (`{currentUser.role}`) does not possess the `access_analytics` or `view_employee_sensitive` permission scopes required to access salary aggregations or headcount reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-cyan-400" />
          <span>Analytics Overview</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Headcount distributions, payroll statistics, and performance KPIs compiled by the Analytics Agent.
        </p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Headcount */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Total Active Headcount</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold text-slate-100">{stats.active}</span>
            <span className="text-xs text-slate-400">/ {stats.total} Employees</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full mt-4 overflow-hidden border border-slate-850">
            <div className="bg-cyan-500 h-full" style={{ width: `${stats.total ? (stats.active / stats.total) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Aggregate Payroll Allocation */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Simulated Annualized Payroll</span>
          <div className="flex items-baseline space-x-1 mt-2">
            <span className="text-slate-500 text-lg font-bold">$</span>
            <span className="text-3xl font-bold text-slate-100">{stats.payrollSum.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-4 block">Application-layer encrypted calculation</span>
        </div>

        {/* Avg Leave Accrued */}
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md">
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Average Accrued Leave Balance</span>
          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-bold text-slate-100">{stats.avgAccrued}</span>
            <span className="text-xs text-slate-400">Days / Employee</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-4 block">Calculated from time-off accrual policies</span>
        </div>

      </div>

      {/* Visual Department distribution simulation */}
      <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
        <h4 className="text-md font-bold text-slate-200">Department Allocation Ratios</h4>
        
        <div className="space-y-4">
          {stats.departments.map(dept => {
            const employees = db.getEmployees(activeOrgId);
            const count = employees.filter(e => e.department === dept).length;
            const pct = Math.round((count / employees.length) * 100);

            return (
              <div key={dept} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-semibold text-slate-350">
                  <span>{dept}</span>
                  <span>{count} staff ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
