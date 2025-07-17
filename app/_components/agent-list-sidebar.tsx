'use client';

import { useEffect } from 'react';
import { useAgentStore } from '@/app/_store/agent-store';
import { Button } from '@/components/ui/button';
import { Bot, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AgentListSidebar() {
  const { agents, selectedAgent, fetchAgents, selectAgent, isLoading } = useAgentStore();

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // 에이전트를 타입별로 그룹화
  const mainAgents = agents.filter(agent => agent.agent_type === 'main');
  const subAgents = agents.filter(agent => agent.agent_type === 'sub');

  return (
    <div className="w-80 border-r bg-muted/10 flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">에이전트 목록</h2>
      </div>
      
      <div className="p-4">
        <Button 
          className="w-full gap-2" 
          onClick={() => selectAgent(null)}
          size="lg"
        >
          <Plus className="h-4 w-4" />
          새 에이전트 추가
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">로딩 중...</p>
          </div>
        ) : (agents?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Bot className="h-12 w-12 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">등록된 에이전트가 없습니다</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Agents */}
            {mainAgents.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  메인 에이전트
                </h3>
                <div className="space-y-1">
                  {mainAgents.map((agent) => (
                    <Button
                      key={agent.id}
                      variant={selectedAgent?.id === agent.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2 h-auto py-3 px-3"
                      onClick={() => selectAgent(agent)}
                    >
                      <Bot className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {agent.model.split('/')[1]}
                        </div>
                      </div>
                      <Badge variant="default" className="text-xs">
                        Main
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Agents */}
            {subAgents.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  전문가 에이전트
                </h3>
                <div className="space-y-1">
                  {subAgents.map((agent) => (
                    <Button
                      key={agent.id}
                      variant={selectedAgent?.id === agent.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2 h-auto py-3 px-3"
                      onClick={() => selectAgent(agent)}
                    >
                      <Bot className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {agent.model.split('/')[1]}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Sub
                      </Badge>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
