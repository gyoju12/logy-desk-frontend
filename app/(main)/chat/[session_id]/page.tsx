'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import ChatView from '@/app/_components/chat-view';

interface ChatPageProps {
  params: {
    session_id: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const { setCurrentSessionId } = useChatStore();

  useEffect(() => {
    if (params.session_id) {
      setCurrentSessionId(params.session_id);
    }
  }, [params.session_id, setCurrentSessionId]);

  return <ChatView />;
}