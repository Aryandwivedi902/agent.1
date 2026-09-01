'use client';

import React from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { Settings, Key, Shield, User, Bell } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Workspace & Account Settings</h1>
          <p className="text-sm text-slate-400">Manage API keys, environment credentials, and team access</p>
        </div>

        <div className="space-y-6">
          {/* Organization Settings */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Organization Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Workspace Name" defaultValue="Personal Workspace" />
              <Input label="Admin Email" defaultValue="aryan.dwivedi@flowforge.ai" />
            </div>
            <Button variant="primary" size="sm">
              Save Profile
            </Button>
          </div>

          {/* OpenAI API Key */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" /> Default LLM API Keys
            </h3>
            <Input label="OpenAI API Key" type="password" defaultValue="sk-proj-********************************" />
            <Input label="Anthropic API Key" type="password" defaultValue="sk-ant-********************************" />
            <Button variant="primary" size="sm">
              Update Keys
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
