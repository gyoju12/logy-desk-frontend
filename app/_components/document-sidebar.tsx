'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDocumentStore } from '@/app/_store/document-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DocumentSidebar() {
  const router = useRouter();
  const params = useParams();
  const currentDocumentId = params.documentId as string;
  
  const { documents, isLoading, fetchDocuments, startPolling, stopPolling } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
    startPolling(10000); // 10초마다 폴링

    return () => {
      stopPolling();
    };
  }, [fetchDocuments, startPolling, stopPolling]);

  const handleDocumentClick = (documentId: string) => {
    router.push(`/knowledge/${documentId}`);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'PROCESSING':
        return 'secondary';
      case 'PENDING':
        return 'outline';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="w-80 h-full bg-background border-r">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            문서 목록
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading && documents.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              업로드된 문서가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc.id)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition-all hover:bg-accent",
                    currentDocumentId === doc.id && "bg-accent"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {doc.filename}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(() => {
                          if (!doc.uploaded_at) return '날짜 정보 없음';
                          let dateString = doc.uploaded_at;
                          if (dateString.endsWith('+00:00Z')) {
                            dateString = dateString.slice(0, -1);
                          }
                          const date = new Date(dateString);
                          if (isNaN(date.getTime())) return '날짜 형식 오류';
                          return date.toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          });
                        })()}
                      </p>
                    </div>
                    <Badge 
                      variant={getStatusBadgeVariant(doc.processing_status)}
                      className="text-xs"
                    >
                      {doc.processing_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
