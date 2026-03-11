"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface UploadZoneProps {
  examId: string;
  onUploadComplete: () => void;
}

export function UploadZone({ examId, onUploadComplete }: UploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const uploadFile = async (uploadFile: UploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile.file);
    formData.append("examId", examId);

    setFiles((prev) =>
      prev.map((f) =>
        f.file === uploadFile.file ? { ...f, status: "uploading", progress: 10 } : f
      )
    );

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Upload failed");
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.file === uploadFile.file
            ? { ...f, status: "success", progress: 100 }
            : f
        )
      );

      onUploadComplete();
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.file === uploadFile.file
            ? {
                ...f,
                status: "error",
                progress: 0,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((f) => uploadFile(f));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [examId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: true,
  });

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <Image className="h-5 w-5 text-blue-500" />;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload
          className={cn(
            "mb-4 h-10 w-10 transition-colors",
            isDragActive ? "text-primary" : "text-muted-foreground"
          )}
        />
        {isDragActive ? (
          <p className="text-sm font-medium text-primary">Drop the files here...</p>
        ) : (
          <>
            <p className="mb-1 text-sm font-medium">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, JPEG, PNG, WEBP
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-md border bg-card p-3"
            >
              {getFileIcon(uploadFile.file)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {uploadFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {uploadFile.status === "uploading" && (
                  <Progress value={uploadFile.progress} className="mt-1 h-1.5" />
                )}
                {uploadFile.status === "error" && (
                  <p className="mt-1 text-xs text-destructive">
                    {uploadFile.error}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {uploadFile.status === "success" && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {uploadFile.status === "error" && (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                )}
                {(uploadFile.status === "success" ||
                  uploadFile.status === "error") && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(uploadFile.file)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
