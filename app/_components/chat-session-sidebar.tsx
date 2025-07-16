'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ChatSessionSidebar() {
  const {
    sessions,
    isFetchingSessions,
    error,
    currentSessionId,
    fetchSessions,
    setCurrentSessionId,
    startNewSession, // Get the new action
  } = useChatStore();

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="flex flex-col h-full p-2">
      <Button 
        className="w-full mb-4" 
        variant="outline" 
        onClick={startNewSession} // Call startNewSession on click
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        New Chat
      </Button>
      <div className="flex-grow overflow-y-auto">
        {isFetchingSessions && <p className="p-4 text-sm text-gray-500">Loading sessions...</p>}
        {error && <p className="p-4 text-sm text-red-500">{error}</p>}
        {!isFetchingSessions && !error && (sessions?.length ?? 0) === 0 && (
          <p className="p-4 text-sm text-gray-500">No chat sessions found.</p>
        )}
        <ul className="space-y-1">
          {sessions.map((session) => (
            <li key={session.id}>
              <Button
                variant={currentSessionId === session.id ? 'secondary' : 'ghost'}
                className="w-full justify-start truncate h-9"
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
