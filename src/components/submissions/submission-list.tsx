"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Image, ChevronRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Submission, SubmissionStatus, OcrStatus, FileType } from "@/types/database";

interface SubmissionListProps {
  examId: string;
}

function statusVariant(
  status: SubmissionStatus
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "GRADED":
    case "REVIEWED":
      return "default";
    case "READY":
    case "GRADING":
      return "secondary";
    case "UPLOADED":
    case "OCR_PROCESSING":
      return "outline";
    default:
      return "outline";
  }
}

function ocrStatusVariant(
  ocrStatus: OcrStatus
): "default" | "secondary" | "outline" | "destructive" {
  switch (ocrStatus) {
    case "COMPLETED":
      return "default";
    case "PROCESSING":
      return "secondary";
    case "FAILED":
      return "destructive";
    default:
      return "outline";
  }
}

function FileIcon({ fileType }: { fileType: FileType }) {
  if (fileType === "PDF") {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  return <Image className="h-4 w-4 text-blue-500" />;
}

export function SubmissionList({ examId }: SubmissionListProps) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/exams/${examId}/submissions`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchSubmissions}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No submissions yet. Upload answer sheets above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </p>
        <Button variant="ghost" size="sm" onClick={fetchSubmissions}>
          <RefreshCw className="mr-2 h-3 w-3" />
          Refresh
        </Button>
      </div>

      <div className="divide-y rounded-lg border">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            onClick={() =>
              router.push(
                `/exams/${examId}/submissions/${submission.id}/review`
              )
            }
            className={cn(
              "flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors",
              "hover:bg-muted/50"
            )}
          >
            <FileIcon fileType={submission.fileType} />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {submission.studentName ||
                  `Submission #${submission.submissionNumber || "?"}`}
              </p>
              {submission.studentNumber && (
                <p className="text-xs text-muted-foreground">
                  {submission.studentNumber}
                </p>
              )}
              <p className="truncate text-xs text-muted-foreground">
                {submission.originalFilename}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <Badge variant={statusVariant(submission.status)}>
                {submission.status.replace(/_/g, " ")}
              </Badge>
              <Badge variant={ocrStatusVariant(submission.ocrStatus)}>
                OCR: {submission.ocrStatus}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
