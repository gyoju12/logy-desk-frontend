'use client';

import { useEffect } from 'react';
import ChatView from "../../_components/chat-view";

export default function ChatPage() {
  useEffect(() => {
    console.log('[Page Render] ChatPage rendered.');
  }, []);

  return (
    <ChatView />
  );
}
