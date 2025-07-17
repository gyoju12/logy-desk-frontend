'use client';

import { useEffect } from 'react';
import { useAgentStore } from '@/app/_store/agent-store';
import { Button } from '@/components/ui/button';

export default function AgentListSidebar() {
  const { agents, selectedAgent, fetchAgents, selectAgent, isLoading } = useAgentStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return (
    <div className="w-64 border-r p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Agents</h2>
      <Button className="w-full mb-4" onClick={() => selectAgent(null)}>+ New Agent</Button>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-gray-500">로딩 중...</p>
        ) : (agents?.length ?? 0) === 0 ? (
          <p className="text-sm text-gray-500">등록된 에이전트가 없습니다.</p>
        ) : (
          agents.map((agent) => (
            <Button
              key={agent.id}
              variant={selectedAgent?.id === agent.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => selectAgent(agent)}
            >
              {agent.name}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
