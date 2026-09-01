'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  RotateCw,
  Save,
  Pencil,
  Bell,
  CheckCircle2,
  Share2,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Plus,
} from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const TopHeader: React.FC = () => {
  const {
    workflowName,
    setWorkflowName,
    workflowStatus,
    setWorkflowStatus,
    isSaved,
    isSaving,
    saveWorkflow,
    undo,
    redo,
    isExecuting,
    runExecutionSimulation,
    setIsAddNodePanelOpen,
  } = useWorkflowStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(workflowName);

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      setWorkflowName(tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* Left side: Breadcrumb & Editable Workflow Name */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          <span>HR Projects</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span>Talent Acquisition</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
        </div>

        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-slate-900 border border-indigo-500 rounded px-2 py-0.5 text-sm font-semibold text-slate-100 focus:outline-none"
            />
          ) : (
            <div
              onClick={() => {
                setTempTitle(workflowName);
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-1.5 cursor-pointer hover:bg-slate-900/60 px-2 py-1 rounded"
            >
              <h1 className="text-sm font-bold text-slate-100">{workflowName}</h1>
              <Pencil className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          )}

          {/* Status Badge */}
          <button
            onClick={() => setWorkflowStatus(workflowStatus === 'published' ? 'draft' : 'published')}
            title="Click to toggle status"
          >
            <Badge variant={workflowStatus === 'published' ? 'success' : 'warning'}>
              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
              {workflowStatus === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Save Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 mr-1">
          {isSaving ? (
            <span className="text-indigo-400 animate-pulse">Saving...</span>
          ) : isSaved ? (
            <span className="flex items-center gap-1 text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Saved
            </span>
          ) : (
            <span className="text-amber-400 font-medium">Unsaved changes</span>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 border-r border-slate-800 pr-2 mr-1">
          <button
            onClick={undo}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Add Node quick button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddNodePanelOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Step
        </Button>

        {/* Save Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={saveWorkflow}
          disabled={isSaving || isSaved}
          icon={<Save className="w-4 h-4 text-slate-400" />}
        >
          Save
        </Button>

        {/* Run Execution Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={runExecutionSimulation}
          disabled={isExecuting}
          icon={<Play className={`w-4 h-4 fill-current ${isExecuting ? 'animate-spin' : ''}`} />}
        >
          {isExecuting ? 'Running...' : 'Run Workflow'}
        </Button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Notification & Actions */}
        <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
        </button>
      </div>
    </header>
  );
};
