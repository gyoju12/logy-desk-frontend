"use client";

import DocumentUploader from "./document-uploader";
import DocumentList from "./document-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KnowledgeManager = () => {
  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>문서 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploader />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>문서 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentList />
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeManager;