'use client';

import { useEffect, useRef } from 'react';
import { Loader2, User, Bot } from 'lucide-react';
import { useChatStore } from '@/app/_store/chat-store';
import { useAgentStore } from '@/app/_store/agent-store';
import { Badge } from '@/components/ui/badge';

export default function MessageList() {
  const { messages, isSending, isFetchingHistory, currentSessionId } = useChatStore();
  const { agents } = useAgentStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // sub agents 필터링
  const subAgents = agents.filter(agent => agent.agent_type === 'sub');

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
    <div className="h-full max-w-4xl mx-auto px-4">
      <div className="space-y-6 py-6">
        {messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* 아바타 */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            {/* 메시지 버블 */}
            <div
              className={`flex-1 ${
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              <div
                className={`relative max-w-[75%] rounded-2xl px-6 py-4 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground border border-border'
                }`}
              >
                {/* 메시지 내용 - 가독성 개선 */}
                <div className="prose prose-base max-w-none">
                  {message.content.split(/\n\n+/).map((paragraph, i) => (
                    <p key={i} className="mb-3 last:mb-0 leading-relaxed">
                      {paragraph.split(/\*\*/).map((part, j) => 
                        j % 2 === 0 ? (
                          part
                        ) : (
                          <strong key={j} className="font-semibold">
                            {part}
                          </strong>
                        )
                      )}
                    </p>
                  ))}
                </div>

                {/* AI 답변인 경우 Specialist Agents 표시 */}
                {message.role === 'assistant' && subAgents.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">활용 전문가:</span>
                      <div className="flex flex-wrap gap-1">
                        {subAgents.map((agent) => (
                          <Badge 
                            key={agent.id} 
                            variant="secondary" 
                            className="text-xs py-0 px-2 h-5"
                          >
                            {agent.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 꼬리 장식 */}
                <div
                  className={`absolute top-4 ${
                    message.role === 'user'
                      ? 'right-0 translate-x-2'
                      : 'left-0 -translate-x-2'
                  }`}
                >
                  <div
                    className={`w-4 h-4 transform rotate-45 ${
                      message.role === 'user'
                        ? 'bg-primary'
                        : 'bg-muted border-l border-t border-border'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="relative max-w-[75%] rounded-2xl px-6 py-4 bg-muted text-foreground border border-border shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50"></span>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
