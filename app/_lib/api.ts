import { toast } from '@/hooks/use-toast';
import { Agent } from '../_store/agent-store';

// --------------------------------------------------------------------------------
// API Client - Centralized Fetch Handler
// --------------------------------------------------------------------------------

async function apiClient<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body: any = null
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const fullUrl = `/api${url}`;

  console.groupCollapsed(`API Request: ${method} ${fullUrl}`);
  console.log('URL:', fullUrl);
  console.log('Method:', method);
  if (body) console.log('Request Body:', body);
  console.groupEnd();

  try {
    const response = await fetch(fullUrl, options);

    const responseData = await response.json();

    console.groupCollapsed(`API Response: ${response.status} ${fullUrl}`);
    console.log('Status:', response.status);
    console.log('Response Data:', responseData);
    console.groupEnd();

    if (!response.ok) {
      throw new Error(responseData.detail || 'An unknown error occurred');
    }

    return responseData as T;
  } catch (error: any) {
    console.groupCollapsed(`API Error: ${method} ${fullUrl}`);
    console.error('Error:', error.message);
    console.groupEnd();

    toast({
      title: 'API Error',
      description: error.message || 'Failed to fetch data from the server.',
      variant: 'destructive',
    });

    throw error;
  }
}

// --------------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------------

export const api = {
  // 3.1. Agents
  createAgent: (agentData: Omit<Agent, 'id'>): Promise<Agent> => {
    return apiClient<Agent>('/agents/', 'POST', agentData);
  },
  getAgents: (type?: 'main' | 'sub'): Promise<Agent[]> => {
    const url = type ? `/agents/?type=${type}` : '/agents/';
    return apiClient<Agent[]>(url, 'GET');
  },
  getAgentById: (agentId: string): Promise<Agent> => {
    return apiClient<Agent>(`/agents/${agentId}/`, 'GET');
  },
  updateAgent: (agentId: string, agentData: Partial<Agent>): Promise<Agent> => {
    return apiClient<Agent>(`/agents/${agentId}/`, 'PUT', agentData);
  },
  deleteAgent: (agentId: string): Promise<void> => {
    return apiClient<void>(`/agents/${agentId}/`, 'DELETE');
  },

  // 3.2. Knowledge Base
  uploadDocument: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    // Note: apiClient needs to be adapted for FormData or use a separate fetch call
    // For now, this will fail as apiClient is JSON-only. This needs to be addressed.
    console.warn('uploadDocument with apiClient is not implemented for FormData yet.');
    // Placeholder - this needs a proper implementation for file uploads.
    return Promise.reject('File upload not implemented');
  },
  getDocuments: (): Promise<any[]> => {
    return apiClient<any[]>('/documents/', 'GET');
  },
  deleteDocument: (documentId: string): Promise<void> => {
    return apiClient<void>(`/documents/${documentId}/`, 'DELETE');
  },

  // 3.3. Chat Sessions
  getChatSessions: (): Promise<any[]> => {
    return apiClient<any[]>('/chats/', 'GET');
  },
  getChatSessionById: (sessionId: string): Promise<any> => {
    return apiClient<any>(`/chats/${sessionId}/`, 'GET');
  },
  deleteChatSession: (sessionId: string): Promise<void> => {
    return apiClient<void>(`/chats/${sessionId}/`, 'DELETE');
  },

  // 3.4. Main Chat
  postChatMessage: (message: string, sessionId: string): Promise<any> => {
    return apiClient<any>(`/chats/${sessionId}/messages/`, 'POST', { message });
  },
};