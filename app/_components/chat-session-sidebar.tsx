'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import { Button } from '@/components/ui/button';

export default function ChatSessionSidebar() {
  const {
    sessions,
    isFetchingSessions,
    error,
    currentSessionId,
    fetchSessions,
    setCurrentSessionId,
  } = useChatStore();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="flex flex-col h-full p-4 border-r bg-gray-50">
      <div className="flex-grow overflow-y-auto">
        {isFetchingSessions && <p>Loading sessions...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isFetchingSessions && !error && (sessions?.length ?? 0) === 0 && (
          <p className="text-gray-500">No chat sessions found.</p>
        )}
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id}>
              <Button
                variant={currentSessionId === session.id ? 'secondary' : 'ghost'}
                className="w-full justify-start truncate"
                onClick={() => setCurrentSessionId(session.id)}
              >
                {session.title || 'New Chat'}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
