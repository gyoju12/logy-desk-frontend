'use client';

import { useEffect } from 'react';
import KnowledgeManager from '@/app/_components/knowledge-manager';

export default function KnowledgePage() {
  useEffect(() => {
    console.log('[Page Render] KnowledgePage rendered.');
  }, []);

  return (
    <div className="w-full h-full bg-background">
      <KnowledgeManager />
    </div>
  );
}