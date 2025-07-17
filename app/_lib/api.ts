import { toast } from '@/hooks/use-toast';
import { Agent } from '../_store/agent-store';
import {ChatSession} from '../_store/chat-store';

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

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Add /v1 prefix for API versioning
  const fullUrl = `/api/v1${url}`;

  console.groupCollapsed(`API Request: ${method} ${fullUrl}`);
  console.log('URL:', fullUrl);
  console.log('Method:', method);
  if (body) console.log('Request Body:', body);
  console.groupEnd();

  try {
    const response = await fetch(fullUrl, options);

    let responseData;
    if (response.status !== 204) { // 204 No Content일 경우 JSON 파싱 시도 안함
      responseData = await response.json();
    } else {
      responseData = {}; // 204일 경우 빈 객체 반환
    }

    console.groupCollapsed(`API Response: ${response.status} ${fullUrl}`);
    console.log('Status:', response.status);
    console.log('Response Data:', responseData);
    console.groupEnd();

    if (!response.ok) {
      let errorMessage = 'An unknown error occurred';
      if (responseData.detail) {
        if (Array.isArray(responseData.detail)) {
          errorMessage = responseData.detail.map((err: any) => err.msg || err.message || JSON.stringify(err)).join(', ');
        } else if (typeof responseData.detail === 'string') {
          errorMessage = responseData.detail;
        } else {
          errorMessage = JSON.stringify(responseData.detail);
        }
      }
      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error: any) {
    console.groupCollapsed(`API Error: ${method} ${fullUrl}`);
    console.error('Error:', error);
    console.groupEnd();

    toast({
      title: 'API Error',
      description: error.message || 'Failed to fetch data from the server.',
      variant: 'destructive',
    });

    throw error;
  }
}

// Helper to normalize agent_type to lowercase
function normalizeAgentType<T extends { agent_type?: string }>(data: T): T {
  if (data && typeof data.agent_type === 'string') {
    return { ...data, agent_type: data.agent_type.toLowerCase() } as T;
  }
  return data;
}

// --------------------------------------------------------------------------------
// API Functions
// --------------------------------------------------------------------------------

export const api = {
  // 3.1. Agents
  createAgent: (agentData: Omit<Agent, 'id'>): Promise<Agent> => {
    return apiClient<Agent>('/agents/', 'POST', agentData).then(normalizeAgentType);
  },
  getAgents: (type?: 'main' | 'sub'): Promise<Agent[]> => {
    const url = type ? `/agents/?type=${type}` : '/agents/';
    return apiClient<Agent[]>(url, 'GET').then(agents => agents.map(normalizeAgentType));
  },
  getAgentById: (agentId: string): Promise<Agent> => {
    return apiClient<Agent>(`/agents/${agentId}/`, 'GET').then(normalizeAgentType);
  },
  updateAgent: (agentId: string, agentData: Partial<Agent>): Promise<Agent> => {
    return apiClient<Agent>(`/agents/${agentId}/`, 'PUT', agentData).then(normalizeAgentType);
  },
  deleteAgent: (agentId: string): Promise<void> => {
    return apiClient<void>(`/agents/${agentId}/`, 'DELETE');
  },

  // 3.2. Knowledge Base
  uploadDocument: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 중앙 집중식 apiClient 대신 직접 fetch 사용 (FormData 처리 이슈로 인해)
      const response = await fetch(`/api/v1/documents/upload/`, {
        method: 'POST',
        body: formData,
        // FormData를 사용할 때는 Content-Type을 설정하지 않아야 브라우저가 자동으로 설정함
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || '파일 업로드에 실패했습니다.');
      }

      return response.json();
    } catch (error) {
      console.error('문서 업로드 중 오류 발생:', error);
      throw error;
    }
  },
  getDocuments: (): Promise<{ documents: any[] }> => {
    return apiClient<{ documents: any[] }>('/documents/', 'GET');
  },
  deleteDocument: (documentId: string): Promise<void> => {
    return apiClient<void>(`/documents/${documentId}/`, 'DELETE');
  },

  // 3.3. Chat Sessions
  createChatSession: (title: string, userId: string): Promise<ChatSession> => {
    return apiClient<ChatSession>('/chat_sessions/', 'POST', { title, user_id: userId });
  },

  getChatSessions: (): Promise<{ sessions: ChatSession[] }> => {
    return apiClient<{ sessions: ChatSession[] }>('/chat_sessions/', 'GET');
  },
  getChatSessionById: (sessionId: string): Promise<any> => {
    return apiClient<any>(`/chat_sessions/${sessionId}/`, 'GET');
  },
  deleteChatSession: (sessionId: string): Promise<void> => {
    return apiClient<void>(`/chat_sessions/${sessionId}/`, 'DELETE');
  },

  getChatMessages: (sessionId: string, limit?: number): Promise<any[]> => {
    const url = limit ? `/chat/${sessionId}/messages?limit=${limit}` : `/chat/${sessionId}/messages`;
    return apiClient<any[]>(url, 'GET');
  },

  // 3.4. Main Chat
  postChatMessage: (message: string, sessionId: string): Promise<{ messages: any[] }> => {
    return apiClient<{ messages: any[] }>(`/chat/${sessionId}/messages`, 'POST', { role: 'user', content: message });
  },
};