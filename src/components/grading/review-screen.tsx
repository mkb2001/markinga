"use client";

import { PdfViewer } from "@/components/grading/pdf-viewer";
import { GradingPanel } from "@/components/grading/grading-panel";
import { cn } from "@/lib/utils";
import type {
  Grade,
  Question,
  Submission,
  AiGradingResult,
  ConfidenceLevel,
  AiModel,
} from "@/types/database";

interface ReviewScreenSubmission extends Pick<
  Submission,
  "id" | "examId" | "studentName" | "studentNumber" | "submissionNumber" | "fileUrl" | "fileType"
> {}

interface ReviewScreenGrade extends Pick<
  Grade,
  | "id"
  | "score"
  | "maxScore"
  | "feedback"
  | "deductions"
  | "aiAveragedScore"
  | "aiConfidence"
  | "confidenceLevel"
  | "humanAdjusted"
  | "isReviewed"
> {}

interface ReviewScreenQuestion extends Pick<
  Question,
  "id" | "questionNumber" | "questionText" | "questionType" | "maxMarks"
> {}

interface ReviewScreenAiResult extends Pick<
  AiGradingResult,
  "id" | "aiModel" | "score" | "maxScore" | "confidence"
> {}

interface ReviewScreenProps {
  submission: ReviewScreenSubmission;
  grade: ReviewScreenGrade;
  question: ReviewScreenQuestion;
  aiResults: ReviewScreenAiResult[];
  submissionIds: string[];
  totalSubmissions: number;
  onMarkReviewed?: (gradeId: string, reviewed: boolean) => Promise<void>;
  className?: string;
}

export function ReviewScreen({
  submission,
  grade,
  question,
  aiResults,
  submissionIds,
  totalSubmissions,
  onMarkReviewed,
  className,
}: ReviewScreenProps) {
  return (
    <div className={cn("flex h-full gap-4 overflow-hidden", className)}>
      {/* Left panel: PDF / image viewer */}
      <div className="flex-1 min-w-0">
        <PdfViewer
          fileUrl={submission.fileUrl ?? ""}
          fileType={submission.fileType ?? "PDF"}
          className="h-full"
        />
      </div>

      {/* Right panel: Grading details */}
      <div className="w-[380px] shrink-0">
        <GradingPanel
          grade={grade}
          question={question}
          submission={submission}
          aiResults={aiResults}
          submissionIds={submissionIds}
          totalSubmissions={totalSubmissions}
          onMarkReviewed={onMarkReviewed}
          className="h-full"
        />
      </div>
    </div>
  );
}
