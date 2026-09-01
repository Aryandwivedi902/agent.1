const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const apiClient = {
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hrflow_token');
    }
    return null;
  },

  setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hrflow_token', token);
    }
  },

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hrflow_token');
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Login failed');
    }

    const data: LoginResponse = await res.json();
    this.setToken(data.token);
    return data;
  },

  async sendChatMessage(message: string): Promise<any> {
    const token = this.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/ai-manager/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ conversationId: 'conv-01', message }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Agent processing error' }));
      throw new Error(err.detail || 'Failed to communicate with HR AI Manager');
    }

    return res.json();
  },

  async getPendingApprovals(): Promise<any[]> {
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/approvals/pending`, { headers });
    if (!res.ok) return [];
    return res.json();
  },

  async executeApproval(id: string, action: 'approve' | 'reject'): Promise<any> {
    const token = this.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/approvals/${id}/action`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      throw new Error('Failed to execute approval action');
    }

    return res.json();
  },

  async getAuditLogs(): Promise<any[]> {
    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/audit-logs`, { headers });
    if (!res.ok) return [];
    return res.json();
  },
};
