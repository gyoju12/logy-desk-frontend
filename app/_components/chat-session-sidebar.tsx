'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function ChatSessionSidebar() {
  const {
    sessions,
    isFetchingSessions,
    error,
    currentSessionId,
    fetchSessions,
    setCurrentSessionId,
    startNewSession, // Get the new action
    deleteSession, // Add deleteSession here
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
            <li key={session.id} className="flex items-center justify-between group">
              <Button
                variant={currentSessionId === session.id ? 'secondary' : 'ghost'}
                className={`w-full justify-start truncate h-9 ${currentSessionId === session.id ? 'hover:bg-secondary' : ''}`}
                onClick={() => setCurrentSessionId(session.id)}
              >
                {session.title || 'New Chat'}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent setCurrentSessionId from being called
                  deleteSession(session.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
