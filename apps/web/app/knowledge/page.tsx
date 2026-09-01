'use client';

import React, { useState } from 'react';
import { HRShell } from '../../components/layout/HRShell';
import { Card3D } from '../../components/ui/Card3D';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BookOpen, Upload, Search, FileText, CheckCircle2, Clock, Trash2, Sliders } from 'lucide-react';
import { KnowledgeDoc } from '../../types/hr-ai';

export default function KnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([
    { id: 'doc-1', title: 'Employee Handbook 2026.pdf', sizeBytes: 3200000, status: 'indexed', category: 'Handbook', lastUpdated: 'Today, 10:00 AM', chunksCount: 142 },
    { id: 'doc-2', title: 'Annual Leave & PTO Policy.pdf', sizeBytes: 1400000, status: 'indexed', category: 'Policy', lastUpdated: 'Yesterday', chunksCount: 48 },
    { id: 'doc-3', title: 'Health & Medical Benefits Guide.pdf', sizeBytes: 4800000, status: 'processing', category: 'Benefits', lastUpdated: 'Just now', chunksCount: 0 },
    { id: 'doc-4', title: '401k Retirement Plan Overview.pdf', sizeBytes: 2100000, status: 'indexed', category: 'Benefits', lastUpdated: '3 days ago', chunksCount: 64 },
  ]);

  return (
    <HRShell>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span>Enterprise HR Knowledge Base (RAG)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Upload company handbooks & policies. Policy Agent uses RAG vector indexing to cite official documents.
            </p>
          </div>

          <Button variant="primary" icon={<Upload className="w-4 h-4" />}>
            Upload HR Document
          </Button>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {docs.map((doc) => (
            <Card3D key={doc.id} className="p-5 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{doc.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(doc.sizeBytes / 1000000).toFixed(1)} MB • {doc.chunksCount} Vector Chunks
                    </span>
                  </div>
                </div>

                <Badge variant={doc.status === 'indexed' ? 'success' : 'purple'}>
                  {doc.status === 'processing' && <Clock className="w-3 h-3 animate-spin mr-1" />}
                  {doc.status.toUpperCase()}
                </Badge>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Updated: {doc.lastUpdated}</span>
                <Button variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}>
                  Delete
                </Button>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </HRShell>
  );
}
