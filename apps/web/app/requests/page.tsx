'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { FileQuestion, AlertCircle, PlusCircle, CheckCircle, MessageSquare } from 'lucide-react';

export default function EmployeeRequests() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [requests, setRequests] = useState<any[]>([]);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [type, setType] = useState<'leave' | 'payroll' | 'benefits' | 'equipment'>('leave');
  
  // Comment state
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const list = db.getRequests(activeOrgId);
    setRequests(list);
    setActiveRequest(list[0] || null);
  }, [activeOrgId]);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Simulate employee submission
    const req = db.addRequest(
      activeOrgId,
      {
        employeeId: 'emp-john',
        employeeName: 'John Doe',
        requestType: type,
        title,
        description,
        priority,
        status: 'open',
        assignedTo: 'Bob Miller'
      },
      currentUser.email
    );

    setRequests(db.getRequests(activeOrgId));
    setActiveRequest(req);
    setTitle('');
    setDescription('');
    refreshData();
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !activeRequest) return;

    db.addRequestComment(activeOrgId, activeRequest.id, `${currentUser.firstName} ${currentUser.lastName}`, commentText, currentUser.email);
    
    // Reload active request comments
    const list = db.getRequests(activeOrgId);
    const updated = list.find(r => r.id === activeRequest.id);
    if (updated) {
      setActiveRequest(updated);
    }
    setRequests(list);
    setCommentText('');
    refreshData();
  };

  const handleResolve = () => {
    if (!activeRequest) return;
    db.updateRequestStatus(activeOrgId, activeRequest.id, 'resolved', currentUser.email);
    
    const list = db.getRequests(activeOrgId);
    setRequests(list);
    setActiveRequest(list.find(r => r.id === activeRequest.id) || null);
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <FileQuestion className="w-8 h-8 text-cyan-400" />
          <span>Requests Console</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Coordinate employee requests and payroll queries with the Employee Request Agent.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ticket List Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tickets Queue</h4>
          </div>
          <div className="space-y-3">
            {requests.map(req => (
              <button
                key={req.id}
                onClick={() => setActiveRequest(req)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  activeRequest?.id === req.id
                    ? 'bg-slate-900/60 border-cyan-500/80 text-slate-200'
                    : 'bg-slate-900/20 border-slate-800 hover:border-slate-700/65 text-slate-450'
                }`}
              >
                <div className="flex justify-between items-start text-[10px]">
                  <span className="font-semibold text-slate-400">{req.employeeName}</span>
                  <span className={`px-2 py-0.5 rounded uppercase font-bold ${
                    req.priority === 'urgent' || req.priority === 'high' 
                      ? 'bg-rose-950/20 text-rose-400' 
                      : 'bg-slate-950 text-slate-500'
                  }`}>
                    {req.priority}
                  </span>
                </div>
                <h5 className="font-bold text-slate-200 mt-1.5 text-xs truncate">{req.title}</h5>
                <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                  <span>Type: {req.requestType}</span>
                  <span className={`font-semibold ${req.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {req.status.toUpperCase()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Ticket details */}
        <div className="lg:col-span-2 space-y-6">
          {activeRequest ? (
            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-850 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{activeRequest.title}</h3>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Opened by {activeRequest.employeeName} on {new Date(activeRequest.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {activeRequest.status === 'open' && (
                  <button
                    onClick={handleResolve}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center space-x-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Resolve Ticket</span>
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 text-xs leading-relaxed text-slate-300 font-sans">
                {activeRequest.description}
              </div>

              {/* Comment Thread */}
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Activity Log & Comments</span>
                <div className="space-y-3">
                  {activeRequest.comments.map((c: any) => (
                    <div key={c.id} className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-slate-350">{c.author}</span>
                        <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-300 font-sans">{c.text}</p>
                    </div>
                  ))}
                </div>

                {activeRequest.status === 'open' && (
                  <div className="flex items-center space-x-3 mt-3">
                    <input
                      type="text"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder="Post a coordinate update note..."
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleAddComment}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition-all border border-slate-700/50"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/10 border border-slate-850 rounded-2xl text-slate-500 text-sm">
              Select a request ticket to view details.
            </div>
          )}

          {/* Submission Form at bottom */}
          <form onSubmit={handleSubmitRequest} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
              <PlusCircle className="w-4 h-4 text-cyan-400" />
              <span>Submit Sandbox Employee Ticket</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Ticket Subject</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Benefits allowance query"
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="leave">Leave Request</option>
                    <option value="payroll">Payroll Query</option>
                    <option value="benefits">Benefits Claim</option>
                    <option value="equipment">Hardware procurement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Ticket Description</label>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Detail the query context..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="py-2 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
            >
              Submit Ticket
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
