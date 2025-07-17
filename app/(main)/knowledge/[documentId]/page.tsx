'use client';

import { useEffect } from 'react';
import DocumentDetail from '@/app/_components/document-detail';
import DocumentSidebar from '@/app/_components/document-sidebar';

interface PageProps {
  params: {
    documentId: string;
  };
}

export default function DocumentDetailPage({ params }: PageProps) {
  useEffect(() => {
    console.log('[Page Render] DocumentDetailPage rendered with ID:', params.documentId);
  }, [params.documentId]);

  return (
    <div className="h-full flex">
      {/* 사이드바 */}
      <DocumentSidebar />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 max-w-4xl">
          <DocumentDetail documentId={params.documentId} />
        </div>
      </div>
    </div>
  );
}
