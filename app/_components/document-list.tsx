"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { useDocumentStore } from "@/app/_store/document-store";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Calendar, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const DocumentList = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { documents, isLoading, fetchDocuments, deleteDocument, startPolling, stopPolling } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
    startPolling(5000); // 5초마다 폴링 시작

    return () => {
      stopPolling(); // 컴포넌트 언마운트 시 폴링 중지
    };
  }, [fetchDocuments, startPolling, stopPolling]);

  const handleDelete = async (e: React.MouseEvent, docId: string, docName: string) => {
    e.stopPropagation(); // Prevent row click event
    await deleteDocument(docId);
    toast({
        title: "삭제 완료",
        description: `${docName} 파일이 성공적으로 삭제되었습니다.`,
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'default';
      case 'PROCESSING': return 'secondary';
      case 'PENDING': return 'outline';
      default: return 'destructive';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return '완료';
      case 'PROCESSING': return '처리중';
      case 'PENDING': return '대기중';
      default: return '오류';
    }
  };

  if (isLoading && (documents?.length ?? 0) === 0) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2 text-muted-foreground">문서 목록을 불러오는 중...</p>
      </div>
    );
  }

  if ((documents?.length ?? 0) === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/40 mb-2" />
        <p className="text-muted-foreground">업로드된 문서가 없습니다</p>
        <p className="text-sm text-muted-foreground mt-1">
          상단의 업로드 영역에 문서를 드래그하여 추가하세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => router.push(`/knowledge/${doc.id}`)}
          className="relative group cursor-pointer transition-all hover:shadow-md border rounded-lg p-4 bg-card hover:bg-accent/50"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate pr-2">{doc.filename}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {(() => {
                      if (!doc.uploaded_at) return '날짜 정보 없음';
                      let dateString = doc.uploaded_at;
                      if (dateString.endsWith('+00:00Z')) {
                        dateString = dateString.slice(0, -1);
                      }
                      const date = new Date(dateString);
                      if (isNaN(date.getTime())) return '날짜 형식 오류';
                      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
                    })()}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant={getStatusVariant(doc.processing_status)} className="flex-shrink-0">
              {getStatusText(doc.processing_status)}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => handleDelete(e, doc.id, doc.filename)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;