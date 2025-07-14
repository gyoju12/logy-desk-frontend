import { create } from 'zustand';
import { useAgentStore } from './agent-store';
import { api } from '@/app/_lib/api';

// As per API.md
export interface ChatMessage {
  id?: string; // id is present in fetched messages
  role: 'user' | 'assistant';
  content: string;
  session_id?: string;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: ChatMessage[];
  isSending: boolean;
  isFetchingHistory: boolean;
  isFetchingSessions: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  fetchMessages: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  setCurrentSessionId: (sessionId: string | null) => void;
  startNewSession: () => void;
  createSession: (agentId: string, title: string) => Promise<string>;
}



export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  messages: [],
  isSending: false,
  isFetchingHistory: false,
  isFetchingSessions: false,
  error: null,

  fetchSessions: async () => {
    set({ isFetchingSessions: true, error: null });
    try {
      const sessionsList = await api.getChatSessions();
      set({ sessions: sessionsList || [], isFetchingSessions: false });
    } catch (error) { 
      console.error("Failed to fetch chat sessions:", error);
      set({ error: 'Failed to fetch chat sessions', isFetchingSessions: false });
    }
  },

  fetchMessages: async (sessionId) => {
    set({ isFetchingHistory: true, messages: [], error: null });
    try {
      const messages = await api.getChatMessages(sessionId, 100);
    } catch (error) {
      console.error(`Failed to fetch messages for session ${sessionId}:`, error);
      set({ isFetchingHistory: false, error: 'Failed to fetch messages' });
    }
  },

  createSession: async (agentId: string, title: string) => {
    try {
      const newSession = await api.createChatSession(agentId, title);
      return newSession.id;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    }
  },

  sendMessage: async (message: string) => {
    const { currentSessionId, messages, fetchMessages } = get();
    const tempId = `temp_${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: tempId,
      session_id: currentSessionId || 'new',
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };

    set({ messages: [...messages, newUserMessage], isSending: true, error: null });

    try {
      if (currentSessionId) {
        // Existing session: API returns only the assistant's message.
        // To ensure data consistency, we refetch all messages after sending.
        await api.postChatMessage(message, currentSessionId);
        await fetchMessages(currentSessionId); // Refetch messages to get the latest state
        set({ isSending: false });

      } else {
        // New session: API returns user_message, assistant_message, and session_id.
        const { agents } = useAgentStore.getState();
        const mainAgent = agents.find(a => a.agent_type === 'main');
        if (!mainAgent) throw new Error('Main agent not found.');

        const responseData = await api.createChatSession(mainAgent.id, message);

        const { user_message, assistant_message, session_id } = response.data;

        set({ currentSessionId: session_id });
        await get().fetchSessions(); // Fetch updated session list

        set(state => ({
          messages: [
            ...state.messages.filter(m => m.id !== tempId),
            user_message,
            assistant_message,
          ],
          isSending: false,
        }));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      set(state => ({
        messages: state.messages.filter(m => m.id !== tempId),
        isSending: false,
        error: 'Failed to send message',
      }));
    }
  },

  deleteSession: async (sessionId: string) => {
    try {
      await api.deleteChatSession(sessionId);
      set(state => ({
        sessions: state.sessions.filter(s => s.id !== sessionId),
      }));
      if (get().currentSessionId === sessionId) {
        set({ currentSessionId: null, messages: [] });
      }
    } catch (error) {
      console.error(`Failed to delete session ${sessionId}:`, error);
      set({ error: 'Failed to delete session' });
    }
  },

  setCurrentSessionId: (sessionId) => {
    set({ currentSessionId: sessionId, messages: [] });
    if (sessionId) {
      get().fetchMessages(sessionId);
    }
  },
  
  startNewSession: () => {
    set({ currentSessionId: null, messages: [] });
  },
}));
