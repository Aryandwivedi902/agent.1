'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { ShieldCheck, UserCheck, PlusCircle } from 'lucide-react';

export default function EmployeesList() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [employees, setEmployees] = useState<any[]>([]);
  const [activeEmployee, setActiveEmployee] = useState<any | null>(null);

  // Form parameters
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [salary, setSalary] = useState('$90,000');

  useEffect(() => {
    const list = db.getEmployees(activeOrgId);
    setEmployees(list);
    setActiveEmployee(list[0] || null);
  }, [activeOrgId]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !jobTitle.trim()) return;

    const newEmp = db.addEmployee(
      activeOrgId,
      {
        employeeIdNumber: 'EMP-' + Math.floor(100 + Math.random() * 900),
        firstName,
        lastName,
        workEmail: email,
        jobTitle,
        department,
        salary,
        bankAccount: 'US...xxxx',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0]
      },
      currentUser.email
    );

    setEmployees(db.getEmployees(activeOrgId));
    setActiveEmployee(newEmp);
    setFirstName('');
    setLastName('');
    setEmail('');
    setJobTitle('');
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
          <span>Employees Directory</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Manage employee files and enforce role-based directory visibility parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Directory list column */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Staff roster</h4>
          <div className="space-y-3">
            {employees.map(emp => (
              <button
                key={emp.id}
                onClick={() => setActiveEmployee(emp)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeEmployee?.id === emp.id
                    ? 'bg-slate-900/60 border-cyan-500/80 text-slate-200'
                    : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/60 text-slate-400'
                }`}
              >
                <span className="font-bold text-slate-350 block text-xs">{emp.firstName} {emp.lastName}</span>
                <span className="text-[10px] text-slate-500 mt-1 block">{emp.jobTitle} • {emp.department}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected profile details display */}
        <div className="lg:col-span-2 space-y-6">
          {activeEmployee ? (
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
              
              <div className="border-b border-slate-850 pb-4">
                <h3 className="text-lg font-bold text-slate-200">{activeEmployee.firstName} {activeEmployee.lastName}</h3>
                <span className="text-xs text-slate-500 mt-1 block">Staff File ID: {activeEmployee.employeeIdNumber}</span>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[10px]">Email Address</span>
                  <span className="text-slate-300 font-mono">{activeEmployee.workEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[10px]">Title & Team</span>
                  <span className="text-slate-300">{activeEmployee.jobTitle} ({activeEmployee.department})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[10px]">Start Date</span>
                  <span className="text-slate-300">{activeEmployee.startDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block uppercase text-[10px]">Salary (Application-Layer Encrypted)</span>
                  <span className="text-slate-300 font-mono font-bold text-cyan-400">{activeEmployee.salary}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/10 border border-slate-850 rounded-2xl text-slate-500 text-sm">
              Select an employee record to display details.
            </div>
          )}

          {/* Submission Form at bottom */}
          <form onSubmit={handleAddEmployee} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Simulate Employee Creation</span>
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
                  placeholder="e.g. Miller"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. john@acme.com"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Staff Analyst"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Salary Parameter</label>
                <input
                  type="text"
                  required
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
            >
              Hire Employee
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
