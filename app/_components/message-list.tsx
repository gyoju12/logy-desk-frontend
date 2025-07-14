'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useChatStore } from '@/app/_store/chat-store';

export default function MessageList() {
  const { messages, isSending, isFetchingHistory, currentSessionId } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  if (isFetchingHistory) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2 text-gray-500">메시지를 불러오는 중...</p>
      </div>
    );
  }

  if (!currentSessionId && (messages?.length ?? 0) === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>상담을 선택하거나 새 상담을 시작하세요.</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="max-w-md rounded-lg px-4 py-2 bg-gray-200 text-gray-900">
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500"></span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500 [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500 [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
