
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '../_store/chat-store';

// yyyy-MM-dd HH:mm 형식으로 날짜를 포맷하는 함수
const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const NewChatDialog = () => {
  const { isNewChatDialogOpen, closeNewChatDialog, confirmNewChatSession } = useChatStore();
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isNewChatDialogOpen) {
      setTitle(`New Chat ${getFormattedDateTime()}`);
    }
  }, [isNewChatDialogOpen]);

  const handleConfirm = async () => {
    if (title.trim()) {
      await confirmNewChatSession(title.trim());
    }
  };

  const handleCancel = () => {
    closeNewChatDialog();
  };

  return (
    <Dialog open={isNewChatDialogOpen} onOpenChange={closeNewChatDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
