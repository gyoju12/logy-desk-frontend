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

    return fetch('/api/documents/upload/', { // 백엔드 파일 업로드 엔드포인트에 맞게 수정 필요
      method: 'POST',
      body: formData,
      // FormData를 사용할 때는 Content-Type 헤더를 명시적으로 설정하지 않습니다.
      // 브라우저가 자동으로 multipart/form-data와 boundary를 설정해줍니다.
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          throw new Error(errorData.detail || '파일 업로드 실패');
        });
      }
      return response.json();
    })
    .catch(error => {
      console.error('File upload error:', error);
      toast({
        title: '파일 업로드 오류',
        description: error.message || '파일 업로드 중 알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
      throw error;
    });
  },
  getDocuments: (): Promise<any[]> => {
    return apiClient<any[]>('/documents/', 'GET');
  },
  deleteDocument: (documentId: string): Promise<void> => {
    return apiClient<void>(`/documents/${documentId}/`, 'DELETE');
  },

  // 3.3. Chat Sessions
  createChatSession: (agentId: string, title: string): Promise<ChatSession> => {
    return apiClient<ChatSession>('/chat_sessions/', 'POST', { agent_id: agentId, title });
  },

  getChatSessions: (): Promise<any[]> => {
    return apiClient<any[]>('/chats/', 'GET');
  },
  getChatSessionById: (sessionId: string): Promise<any> => {
    return apiClient<any>(`/chats/${sessionId}/`, 'GET');
  },
  deleteChatSession: (sessionId: string): Promise<void> => {
    return apiClient<void>(`/chats/${sessionId}/`, 'DELETE');
  },

  getChatMessages: (sessionId: string, limit?: number): Promise<any[]> => {
    const url = limit ? `/chats/${sessionId}/messages/?limit=${limit}` : `/chats/${sessionId}/messages/`;
    return apiClient<any[]>(url, 'GET');
  },

  // 3.4. Main Chat
  postChatMessage: (message: string, sessionId: string): Promise<any> => {
    return apiClient<any>(`/chats/${sessionId}/messages/`, 'POST', { message });
  },
};