'use client';

import { useState } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';

interface MessageInputProps {
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  disabled = false, 
  placeholder = "메시지를 입력하세요..." 
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { sendMessage, isSending } = useChatStore();

  const handleSend = () => {
    if (message.trim() && !isSending) {
      sendMessage(message);
      setMessage('');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border shadow-sm">
        <Input
          type="text"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled || isSending}
          className="flex-1 text-base bg-background border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
        />
        <Button 
          onClick={handleSend} 
          disabled={!message.trim() || isSending || disabled}
          size="lg"
          className="rounded-xl px-6"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
