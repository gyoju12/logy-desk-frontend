'use client';

import { useState } from 'react';
import { useChatStore } from '@/app/_store/chat-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MessageInputProps {
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({ 
  disabled = false, 
  placeholder = "Type your message..." 
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
    <div className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="w-full"
      />
      <Button onClick={handleSend} disabled={!message.trim() || isSending}>
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
      </Button>
    </div>
  );
}
