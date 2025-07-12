'use client';

import { useEffect } from 'react';
import { useAgentStore } from '@/app/_store/agent-store';
import { Badge } from '@/components/ui/badge';

export default function SubAgentDisplay() {
  const { agents, fetchAgents } = useAgentStore();

  useEffect(() => {
    fetchAgents('sub');
  }, [fetchAgents]);

  return (
    <div className="p-4 border-b">
      <h3 className="text-sm font-semibold mb-2">Specialist Agents</h3>
      <div className="flex flex-wrap gap-2">
        {agents.map((agent) => (
          <Badge key={agent.id} variant="secondary">{agent.name}</Badge>
        ))}
      </div>
    </div>
  );
}
