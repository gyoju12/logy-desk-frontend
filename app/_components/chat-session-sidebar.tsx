'use client';

import { useEffect } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function ChatSessionSidebar() {
  const {
    sessions,
    isFetchingSessions,
    error,
    currentSessionId,
    fetchSessions,
    setCurrentSessionId,
    startNewSession,
    deleteSession,
  } = useChatStore();

  useEffect(() => {
    fetchSessions();
  }, []);

  // 세션을 날짜별로 그룹화
  const groupSessionsByDate = () => {
    if (!sessions || sessions.length === 0) return {};
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const groups: { [key: string]: typeof sessions } = {
      '오늘': [],
      '어제': [],
      '이전': []
    };
    
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (sessionDate.getTime() === today.getTime()) {
        groups['오늘'].push(session);
      } else if (sessionDate.getTime() === yesterday.getTime()) {
        groups['어제'].push(session);
      } else {
        groups['이전'].push(session);
      }
    });
    
    // 빈 그룹 제거
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  };

  const groupedSessions = groupSessionsByDate();

  return (
    <div className="w-80 border-r bg-muted/10 flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">상담 목록</h2>
      </div>
      
      <div className="p-4">
        <Button 
          className="w-full gap-2" 
          onClick={startNewSession}
          size="lg"
        >
          <Plus className="h-4 w-4" />
          새 상담 시작
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isFetchingSessions ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">상담 목록을 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : (sessions?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">진행 중인 상담이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSessions).map(([dateGroup, groupSessions]) => (
              <div key={dateGroup}>
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {dateGroup}
                </h3>
                <div className="space-y-1">
                  {groupSessions.map((session) => (
                    <div key={session.id} className="group relative">
                      <Button
                        variant={currentSessionId === session.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-2 h-auto py-3 px-3 pr-10"
                        onClick={() => setCurrentSessionId(session.id)}
                      >
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 text-left overflow-hidden">
                          <div className="font-medium truncate">
                            {session.title || '새 상담'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(session.created_at), { 
                              addSuffix: true,
                              locale: ko 
                            })}
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
