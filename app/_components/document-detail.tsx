'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, Clock, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useDocumentStore } from '@/app/_store/document-store';

interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  embedding_status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  num_tokens: number;
  created_at: string;
  updated_at: string;
}

interface DocumentDetailProps {
  documentId: string;
}

export default function DocumentDetail({ documentId }: DocumentDetailProps) {
  const router = useRouter();
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDocumentName } = useDocumentStore();

  useEffect(() => {
    fetchDocumentChunks();
  }, [documentId]);

  const fetchDocumentChunks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/v1/documents/${documentId}/chunks`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('문서를 찾을 수 없습니다.');
        }
        throw new Error('문서 청크를 불러오는 중 오류가 발생했습니다.');
      }
      
      const data = await response.json();
      setChunks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-48" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/knowledge')} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" />
          지식 베이스로 돌아가기
        </Button>
      </div>
    );
  }

  const documentName = getDocumentName(documentId);

  return (
    <div className="h-full p-8 overflow-y-auto bg-background">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{documentName || '문서 상세'}</h1>
          <p className="text-muted-foreground">
            문서 ID: {documentId}
          </p>
        </div>

        {/* 청크 목록 */}
        <div className="space-y-6">
          {chunks.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  이 문서에 대한 청크가 없습니다.
                </p>
              </CardContent>
            </Card>
          ) : (
            chunks.map((chunk, index) => (
              <Card key={chunk.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">청크 #{index + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={chunk.embedding_status === 'COMPLETED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {chunk.embedding_status === 'COMPLETED' ? '임베딩 완료' : 
                         chunk.embedding_status === 'PENDING' ? '대기 중' : '처리 중'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {chunk.num_tokens} 토큰
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-2 text-sm">
                    생성일: {format(new Date(chunk.created_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full rounded-lg border border-border/50 p-8 bg-muted/20">
                    <div className="prose prose-lg max-w-none">
                      {chunk.content.split(/\n\n+/).map((paragraph, index) => (
                        <p key={index} className="mb-6 last:mb-0 text-base leading-[2] text-foreground/90">
                          {paragraph.split(/\*\*/).map((part, i) => 
                            i % 2 === 0 ? part : <strong key={i} className="font-semibold text-primary">{part}</strong>
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    청크 ID: {chunk.id}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
