"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { useDocumentStore } from '@/app/_store/document-store';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DocumentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50",
          file && "border-solid border-primary bg-primary/5"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={() => !file && inputRef.current?.click()}
      >
        <Input
          id="file-upload"
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.txt,.docx,.doc"
        />
        
        {!file ? (
          <>
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">파일을 여기에 드래그하세요</h3>
            <p className="text-sm text-muted-foreground">또는 클릭하여 파일을 선택하세요</p>
            <p className="text-xs text-muted-foreground mt-2">PDF, TXT, DOCX 형식 지원</p>
          </>
        ) : (
          <div className="w-full max-w-md">
            <div className="flex items-start gap-3 p-4 bg-background rounded-lg border">
              <FileText className="h-10 w-10 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                {isUploading && (
                  <Progress value={50} className="mt-2" />
                )}
              </div>
              {!isUploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (inputRef.current) {
                      inputRef.current.value = '';
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }} 
              disabled={isUploading} 
              className="w-full mt-4 gap-2"
              size="lg"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? '업로드 중...' : '업로드 시작'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;