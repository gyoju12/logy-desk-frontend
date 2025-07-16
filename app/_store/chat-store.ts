import { create } from 'zustand';
import { useAuthStore } from './auth-store';
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
  isNewChatDialogOpen: boolean; // New state for dialog

  fetchSessions: () => Promise<void>;
  fetchMessages: (sessionId: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  setCurrentSessionId: (sessionId: string | null) => void;
  startNewSession: () => void;
  createSession: (agentId: string, title: string) => Promise<string>;

  // New actions for dialog
  openNewChatDialog: () => void;
  closeNewChatDialog: () => void;
  confirmNewChatSession: (title: string) => Promise<void>;
}



export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSessionId: null,
  messages: [],
  isSending: false,
  isFetchingHistory: false,
  isFetchingSessions: false,
  error: null,
  isNewChatDialogOpen: false, // Initial state

  // ... (fetchSessions, fetchMessages, createSession remain the same)
  fetchSessions: async () => {
    set({ isFetchingSessions: true, error: null });
    try {
      const fetchedSessions = await api.getChatSessions();
      const sessionsArray = Array.isArray(fetchedSessions) ? fetchedSessions : fetchedSessions.sessions || [];
      set({ sessions: sessionsArray, isFetchingSessions: false });
    } catch (error) { 
      console.error("Failed to fetch chat sessions:", error);
      set({ error: 'Failed to fetch chat sessions', isFetchingSessions: false });
    }
  },

  fetchMessages: async (sessionId) => {
    set({ isFetchingHistory: true, messages: [], error: null });
    try {
      const fetchedMessages = await api.getChatMessages(sessionId, 100);
      set({ messages: fetchedMessages || [], isFetchingHistory: false });
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
    
    if (!currentSessionId) {
      console.error("Cannot send message without an active session.");
      set({ error: "No active session to send message to." });
      return;
    }

    const tempId = `temp_${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: tempId,
      session_id: currentSessionId,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };

    set({ messages: [...messages, newUserMessage], isSending: true, error: null });

    try {
      await api.postChatMessage(message, currentSessionId);
      await fetchMessages(currentSessionId); 
      set({ isSending: false });
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
    get().openNewChatDialog();
  },

  // --- New Dialog Actions ---
  openNewChatDialog: () => {
    set({ isNewChatDialogOpen: true });
  },

  closeNewChatDialog: () => {
    set({ isNewChatDialogOpen: false });
  },

  confirmNewChatSession: async (title: string) => {
    set({ isSending: true, error: null });
    try {
      const { userId } = useAuthStore.getState();
      if (!userId) {
        throw new Error('User not logged in. Cannot create session.');
      }

      const newSession = await api.createChatSession(title, userId);
      
      await get().fetchSessions(); // Refresh session list
      
      set({ 
        currentSessionId: newSession.id, // Use newSession.id
        messages: [], // Start with an empty message list
        isNewChatDialogOpen: false,
        isSending: false 
      });

    } catch (error) {
      console.error("Failed to create new chat session:", error);
      set({ error: 'Failed to create session', isSending: false });
    }
  },
}));
