import { useAgentStore, Agent } from '../_store/agent-store';
import { useChatStore } from '../_store/chat-store';
import { useDocumentStore, Document } from '../_store/document-store';

// This file will contain mock API functions that interact with Zustand stores.
// Later, these functions will be replaced with actual fetch calls to the backend.

// 3.1. Agents
export const api = {
  createAgent: (agentData: Omit<Agent, 'id'>) => {
    return useAgentStore.getState().createAgent(agentData);
  },
  getAgents: (type?: 'main' | 'sub') => {
    return useAgentStore.getState().fetchAgents(type);
  },
  getAgentById: (agentId: string) => {
    // This would be a separate endpoint, but for mock, we filter
    const { agents } = useAgentStore.getState();
    return agents.find(a => a.id === agentId);
  },
  updateAgent: (agentId: string, agentData: Partial<Agent>) => {
    return useAgentStore.getState().updateAgent(agentId, agentData);
  },
  deleteAgent: (agentId: string) => {
    return useAgentStore.getState().deleteAgent(agentId);
  },

  // 3.2. Knowledge Base
  uploadDocument: (file: File) => {
    return useDocumentStore.getState().uploadDocument(file);
  },
  getDocuments: () => {
    return useDocumentStore.getState().fetchDocuments();
  },
  deleteDocument: (documentId: string) => {
    return useDocumentStore.getState().deleteDocument(documentId);
  },

  // 3.3. Chat Sessions
  getChatSessions: () => {
    return useChatStore.getState().fetchSessions();
  },
  getChatSessionById: (sessionId: string) => {
    return useChatStore.getState().fetchMessages(sessionId);
  },
  deleteChatSession: (sessionId: string) => {
    // Mock implementation
    console.log(`Deleting session ${sessionId}`);
  },

  // 3.4. Main Chat
  postChatMessage: (userMessage: string, sessionId: string) => {
    return useChatStore.getState().sendMessage(userMessage);
  },
};
