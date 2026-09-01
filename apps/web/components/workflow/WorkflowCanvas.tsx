'use client';

import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../../store/useWorkflowStore';
import { CustomWorkflowNode } from './CustomWorkflowNode';
import { Plus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const WorkflowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodeId,
    setIsAddNodePanelOpen,
    theme,
  } = useWorkflowStore();

  const nodeTypes = useMemo(() => ({ customNode: CustomWorkflowNode as any }), []);

  return (
    <div className="relative flex-1 h-full w-full bg-slate-950 overflow-hidden select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onPaneClick={() => setSelectedNodeId(null)}
        fitView
        colorMode={theme}
        defaultEdgeOptions={{
          animated: true,
          style: { strokeWidth: 2, stroke: '#6366f1' },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#334155" />
        
        {/* Canvas Toolbar Panel */}
        <Panel position="top-right" className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddNodePanelOpen(true)}
            icon={<Plus className="w-4 h-4 text-indigo-400" />}
          >
            Add Node
          </Button>
        </Panel>

        {/* Custom Zoom & View Controls */}
        <Controls
          showInteractive={false}
          className="!bg-slate-900 !border !border-slate-800 !rounded-lg !shadow-lg text-slate-300"
        />

        {/* MiniMap in Bottom Corner */}
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.category === 'trigger') return '#10b981';
            if (n.data?.category === 'ai') return '#6366f1';
            if (n.data?.category === 'logic') return '#f59e0b';
            if (n.data?.category === 'integration') return '#38bdf8';
            return '#a855f7';
          }}
          className="!bg-slate-900/90 !border !border-slate-800 !rounded-lg"
          maskColor="rgba(15, 23, 42, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};
