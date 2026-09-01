'use client';

import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { TopHeader } from '../components/layout/TopHeader';
import { WorkflowCanvas } from '../components/workflow/WorkflowCanvas';
import { AddNodePanel } from '../components/workflow/AddNodePanel';
import { NodeConfigDrawer } from '../components/workflow/NodeConfigDrawer';
import { ExecutionLogsPanel } from '../components/workflow/ExecutionLogsPanel';

export default function WorkflowEditorPage() {
  return (
    <AppLayout>
      <TopHeader />
      <div className="relative flex-1 flex flex-row h-full min-h-0 overflow-hidden">
        <WorkflowCanvas />
        <NodeConfigDrawer />
        <AddNodePanel />
      </div>
      <ExecutionLogsPanel />
    </AppLayout>
  );
}
