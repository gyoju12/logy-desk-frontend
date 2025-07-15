'use client';

import { useEffect } from 'react';
import AgentManager from '../../_components/agent-manager';

export default function AgentsPage() {
  useEffect(() => {
    console.log('[Page Render] AgentsPage rendered.');
  }, []);

  return (
    <div className="w-full">
        <div className="p-4">
            <AgentManager />
        </div>
    </div>
  );
}
