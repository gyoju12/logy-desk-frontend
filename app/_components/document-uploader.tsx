"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useDocumentStore } from '@/app/_store/document-store';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

const DocumentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { uploadDocument, uploadStatus, fetchDocuments } = useDocumentStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (uploadStatus === 'success') {
      toast({
        title: "업로드 성공",
        description: `${file?.name} 파일이 성공적으로 업로드되었습니다.`,
      });
      setFile(null);
      fetchDocuments(); // 업로드 성공 시 목록 새로고침
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } else if (uploadStatus === 'error') {
      toast({
        title: "업로드 실패",
        description: "파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  }, [uploadStatus, toast, file?.name, fetchDocuments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "파일을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if ((file?.name?.length ?? 0) > 255) {
      toast({
        title: "파일 이름이 너무 깁니다.",
        description: "파일 이름은 255자 이하여야 합니다.",
        variant: "destructive",
      });
      return;
    }

    await uploadDocument(file);
  };

  const isUploading = uploadStatus === 'uploading';

  return (
    <div
      className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          setFile(e.dataTransfer.files[0]);
        }
      }}
      onClick={() => inputRef.current?.click()}
    >
      <p className="text-lg text-muted-foreground mb-2">파일을 여기에 드래그하거나 클릭하여 선택하세요.</p>
      <Input
        id="file-upload"
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {file && (
        <div className="flex flex-col items-center space-y-2 mt-2 w-full">
          <span className="text-sm font-medium truncate">{file.name}</span>
          {isUploading && (
            <Progress value={uploadStatus === 'uploading' ? 50 : 100} className="w-full" />
          )}
          <Button onClick={handleUpload} disabled={isUploading} size="sm" className="w-full">
            {isUploading ? '업로드 중...' : '업로드'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;