'use client';

import MessageList from './message-list';
import MessageInput from './message-input';
import { useEffect } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import { useAgentStore } from '@/app/_store/agent-store';

export default function ChatView() {
  const { startNewSession, currentSessionId, fetchSessions } = useChatStore();
  const { agents, fetchAgents } = useAgentStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 최초 한 번만 세션과 에이전트를 가져옵니다.
    fetchSessions();
    fetchAgents('main');
    fetchAgents('sub'); // sub agents도 미리 로드
  }, [fetchSessions, fetchAgents]);

  const mainAgent = agents.find(agent => agent.agent_type === 'main');
  // isReady 조건은 세션 ID가 있거나 메인 에이전트가 로드되었을 때로 유지합니다.
  const isReady = currentSessionId !== null || mainAgent !== undefined;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto min-h-0">
        <MessageList />
      </div>
      <div className="py-4 border-t bg-background/95 backdrop-blur">
        <MessageInput 
          disabled={!isReady}
          placeholder={isReady ? "메시지를 입력하세요..." : "메인 에이전트를 불러오는 중..."}
        />
      </div>
    </div>
  );
}
