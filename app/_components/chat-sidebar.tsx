'use client';

import ChatSessionSidebar from './chat-session-sidebar';

export default function ChatSidebar() {
  return (
    <aside className="w-64 flex flex-col h-full border-r bg-gray-50">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">상담 목록</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatSessionSidebar />
      </div>
    </aside>
  );
}
