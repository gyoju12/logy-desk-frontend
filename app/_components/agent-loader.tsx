'use client';

import { useEffect, useRef } from 'react';
import { useAgentStore } from '@/app/_store/agent-store';

/**
 * This component ensures that the agent list is loaded when the main layout mounts.
 * It prevents race conditions where other stores might need agent data before it's available.
 */
export default function AgentLoader() {
  const { fetchAgents } = useAgentStore();
  const loaded = useRef(false);

  useEffect(() => {
    // Use a ref to ensure this effect runs only once on mount.
    if (!loaded.current) {
      loaded.current = true;
      // Fetch both main and sub agents to populate the store upfront.
      fetchAgents('main');
      fetchAgents('sub');
    }
  }, [fetchAgents]);

  return null; // This component does not render anything.
}
