import { create } from 'zustand';
import { api } from '@/app/_lib/api';

// As per API.md
export interface Agent {
  id: string;
  name: string;
  agent_type: 'main' | 'sub';
  model: string;
  temperature: number;
  system_prompt: string;
}

export type CreateAgentData = Omit<Agent, 'id'>;
export type UpdateAgentData = Partial<Omit<Agent, 'id'>>;

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  error: string | null;
  fetchAgents: (type?: 'main' | 'sub') => Promise<void>;
  createAgent: (agentData: CreateAgentData) => Promise<void>;
  updateAgent: (agentId: string, agentData: UpdateAgentData) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
  selectAgent: (agent: Agent | null) => void;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  selectedAgent: null,
  isLoading: false,
  error: null,

  fetchAgents: async (type) => {
    set({ isLoading: true, error: null });
    try {
      const fetchedAgents = await api.getAgents(type);
      
      set(state => {
        const existingAgents = new Map(state.agents.map(a => [a.id, a]));
        fetchedAgents.forEach((agent: Agent) => {
          existingAgents.set(agent.id, agent);
        });
        return { agents: Array.from(existingAgents.values()), isLoading: false };
      });

    } catch (error) {
      console.error(`Failed to fetch agents (type: ${type}):`, error);
      set({ isLoading: false, error: `Failed to fetch ${type || 'all'} agents` });
    }
  },

  createAgent: async (agentData) => {
    set({ isLoading: true, error: null });
    try {
      await api.createAgent(agentData);
      await get().fetchAgents(); // Refresh the list
    } catch (error) {
      console.error("Failed to create agent:", error);
      set({ isLoading: false, error: 'Failed to create agent' });
      throw error; // Re-throw to be caught in the component for toast notifications
    }
  },

  updateAgent: async (agentId, agentData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAgent = await api.updateAgent(agentId, agentData);

      set(state => ({
        agents: state.agents.map(a => (a.id === agentId ? updatedAgent : a)),
        selectedAgent: state.selectedAgent?.id === agentId ? updatedAgent : state.selectedAgent,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to update agent:", error);
      set({ isLoading: false, error: 'Failed to update agent' });
      throw error;
    }
  },

  deleteAgent: async (agentId) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteAgent(agentId);
      set(state => ({
        agents: state.agents.filter(a => a.id !== agentId),
        selectedAgent: state.selectedAgent?.id === agentId ? null : state.selectedAgent,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete agent:", error);
      set({ isLoading: false, error: 'Failed to delete agent' });
      throw error;
    }
  },

  selectAgent: (agent) => {
    set({ selectedAgent: agent });
  },
}));
