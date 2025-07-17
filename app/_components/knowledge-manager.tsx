"use client";

import DocumentUploader from "./document-uploader";
import DocumentList from "./document-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";

const KnowledgeManager = () => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">지식 베이스 관리</h1>
            <p className="text-muted-foreground mt-1">
              AI 상담에 활용할 문서를 업로드하고 관리합니다
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <CardTitle>문서 업로드</CardTitle>
            </div>
            <CardDescription>
              PDF, TXT, DOCX 등 다양한 형식의 문서를 업로드할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploader />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>업로드된 문서</CardTitle>
            <CardDescription>
              업로드된 문서 목록과 처리 상태를 확인할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentList />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeManager;