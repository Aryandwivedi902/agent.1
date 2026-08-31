'use client';

import React, { useEffect, useState } from 'react';
import { useApp, db } from '../../components/providers/AppContext';
import { BookOpen, Search, UploadCloud, FileText, CheckCircle, Database } from 'lucide-react';

export default function PoliciesKnowledge() {
  const { activeOrgId, currentUser, refreshData } = useApp();
  const [policies, setPolicies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  // Upload form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Operations');
  const [summary, setSummary] = useState('');
  const [chunksInput, setChunksInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setPolicies(db.getPolicies(activeOrgId));
    setSearchResults([]);
  }, [activeOrgId]);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chunksInput.trim()) return;

    // Split chunks by newline
    const chunks = chunksInput.split('\n').filter(c => c.trim().length > 0);
    
    db.uploadPolicy(activeOrgId, title, summary, category, chunks, currentUser.email);
    setPolicies(db.getPolicies(activeOrgId));
    
    setTitle('');
    setSummary('');
    setChunksInput('');
    setIsSuccess(true);
    refreshData();
    
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results: string[] = [];
    const queryLower = searchQuery.toLowerCase();
    
    // Simulating Tenant-Isolated Semantic Search
    const orgPolicies = db.getPolicies(activeOrgId);
    orgPolicies.forEach(pol => {
      pol.chunks.forEach(c => {
        if (c.toLowerCase().includes(queryLower)) {
          results.push(`[${pol.title}] ${c}`);
        }
      });
    });

    setSearchResults(results);
    db.logAudit(activeOrgId, currentUser.email, 'user', 'KNOWLEDGE_SEARCH', 'knowledge_chunks', 'success', `Searched policies matching query: "${searchQuery}"`);
    refreshData();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-cyan-400" />
          <span>Policies & Knowledge Base</span>
        </h2>
        <p className="text-slate-400 mt-1.5 text-sm">
          Upload handbooks and configure vector storage context chunks for semantic AI query resolution.
        </p>
      </div>

      {/* Search and Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Search & Policy List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tenant Semantic Search Tool */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <h4 className="text-md font-bold text-slate-200 flex items-center space-x-2">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Simulated Tenant-Isolated RAG Search</span>
            </h4>
            <div className="flex space-x-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search policy indexes (e.g. carry over)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSearch}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all"
              >
                Query Index
              </button>
            </div>

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 bg-slate-950 p-4 border border-slate-850 rounded-xl max-h-48 overflow-y-auto custom-scrollbar">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Vector DB Search Results (Tenancy Guard Enabled)</span>
                {searchResults.map((res, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-900/50 border border-slate-850 rounded text-xs text-slate-300 leading-relaxed font-mono">
                    {res}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* List of active policies */}
          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <h4 className="text-md font-bold text-slate-200">Indexed Company Documents</h4>
            <div className="space-y-3">
              {policies.map(pol => (
                <div key={pol.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-300 block text-sm">{pol.title}</span>
                    <p className="text-slate-500">{pol.summary}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-600 mt-2 font-medium">
                      <span>Category: {pol.category}</span>
                      <span>•</span>
                      <span>Version {pol.version} (Published)</span>
                      <span>•</span>
                      <span>Effective: {pol.effectiveDate}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 font-bold border border-cyan-900/40 text-[9px] uppercase">
                    ACTIVE
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Upload Form */}
        <div>
          <form onSubmit={handleUpload} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-md space-y-4">
            <h4 className="text-md font-bold text-slate-200 flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Index Document</span>
            </h4>
            
            {isSuccess && (
              <div className="flex items-center space-x-2 p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-xl text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Document processed and RAG chunks cached.</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Document Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Leave Accrual Standards"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-350 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-350 outline-none focus:border-cyan-500"
              >
                <option value="General Operations">General Operations</option>
                <option value="Time Off">Time Off & Accruals</option>
                <option value="Benefits">Benefits & Health</option>
                <option value="Compliance">Legal & Compliance</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Summary / Changelog</label>
              <input
                type="text"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Brief summary of document content..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-350 outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                Document Content Chunks (Enter chunks separated by lines)
              </label>
              <textarea
                required
                value={chunksInput}
                onChange={e => setChunksInput(e.target.value)}
                rows={5}
                placeholder="Enter document text segments..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-350 outline-none focus:border-cyan-500 font-sans"
              />
              <span className="text-[9px] text-slate-600 block mt-1 leading-normal">
                AI parses text inputs using RAG vector algorithms, tagging segments with organization_id credentials for isolation guards.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Parse & Upload
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
