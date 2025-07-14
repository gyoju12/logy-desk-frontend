"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useDocumentStore } from "@/app/_store/document-store";

const DocumentList = () => {
  const { toast } = useToast();
  const { documents, isLoading, fetchDocuments, deleteDocument } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (docId: string, docName: string) => {
    await deleteDocument(docId);
    toast({
        title: "삭제 완료",
        description: `${docName} 파일이 성공적으로 삭제되었습니다.`,
    });
  };

  if (isLoading && (documents?.length ?? 0) === 0) {
    return <div className="text-center p-4">문서 목록을 불러오는 중...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>파일명</TableHead>
          <TableHead>업로드 날짜</TableHead>
          <TableHead className="text-right">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(documents?.length ?? 0) === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center h-24">
              업로드된 문서가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.filename}</TableCell>
              <TableCell className="text-center">
                {new Date(doc.uploaded_at).toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(doc.id, doc.filename)}
                  disabled={isLoading}
                >
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default DocumentList;