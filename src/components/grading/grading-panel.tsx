"use client";

import { useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScoreBadge } from "@/components/grading/score-badge";
import { ConfidenceIndicator } from "@/components/grading/confidence-indicator";
import { DeductionList, type Deduction } from "@/components/grading/deduction-list";
import { SubmissionNav } from "@/components/grading/submission-nav";
import { AiModelBadge } from "@/components/grading/ai-model-badge";
import { cn } from "@/lib/utils";
import type {
  Grade,
  Question,
  Submission,
  AiGradingResult,
  ConfidenceLevel,
  AiModel,
} from "@/types/database";

interface GradingPanelProps {
  grade: Pick<
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
  >;
  question: Pick<
    Question,
    "id" | "questionNumber" | "questionText" | "questionType" | "maxMarks"
  >;
  submission: Pick<
    Submission,
    "id" | "examId" | "studentName" | "studentNumber" | "submissionNumber"
  >;
  aiResults: Pick<AiGradingResult, "id" | "aiModel" | "score" | "maxScore" | "confidence">[];
  submissionIds: string[];
  totalSubmissions: number;
  onMarkReviewed?: (gradeId: string, reviewed: boolean) => Promise<void>;
  className?: string;
}

export function GradingPanel({
  grade,
  question,
  submission,
  aiResults,
  submissionIds,
  totalSubmissions,
  onMarkReviewed,
  className,
}: GradingPanelProps) {
  const [isReviewed, setIsReviewed] = useState(grade.isReviewed ?? false);
  const [isPending, startTransition] = useTransition();

  const currentIndex = submissionIds.indexOf(submission.id);
  const currentNumber = currentIndex >= 0 ? currentIndex + 1 : 1;

  const deductions = Array.isArray(grade.deductions)
    ? (grade.deductions as unknown as Deduction[])
    : [];

  function handleReviewedChange(checked: boolean) {
    setIsReviewed(checked);
    if (onMarkReviewed) {
      startTransition(async () => {
        await onMarkReviewed(grade.id, checked);
      });
    }
  }

  return (
    <div
      data-tour="review"
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-background",
        className
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Question {question.questionNumber}
            </p>
            <h2 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
              {question.questionText}
            </h2>
          </div>
          <ScoreBadge score={grade.score} maxScore={grade.maxScore} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2" data-tour="confidence">
          <span className="text-xs text-muted-foreground">Autograded</span>
          {grade.confidenceLevel && (
            <ConfidenceIndicator
              confidenceLevel={grade.confidenceLevel as ConfidenceLevel}
              confidenceScore={grade.aiConfidence}
            />
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className="space-y-5 p-5">
          {/* Student info */}
          <div className="rounded-md bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{submission.studentName ?? "Unknown Student"}</span>
              {submission.studentNumber && (
                <span className="text-muted-foreground">
                  · #{submission.studentNumber}
                </span>
              )}
            </div>
          </div>

          {/* AI Model Scores */}
          {aiResults.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                AI Model Scores
              </p>
              <div className="flex flex-wrap gap-2">
                {aiResults.map((result) => (
                  <AiModelBadge
                    key={result.id}
                    model={result.aiModel as AiModel}
                    score={result.score}
                    maxScore={result.maxScore}
                  />
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Feedback */}
          {grade.feedback && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                AI Feedback
              </p>
              <p className="text-sm leading-relaxed text-foreground">
                {grade.feedback}
              </p>
            </div>
          )}

          {/* Deductions */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Deductions
            </p>
            <DeductionList deductions={deductions} />
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="shrink-0 space-y-3 border-t bg-background px-5 py-4">
        <SubmissionNav
          current={currentNumber}
          total={totalSubmissions}
          examId={submission.examId}
          submissionIds={submissionIds}
        />

        <Separator />

        <div className="flex items-center gap-2">
          <Checkbox
            id="mark-reviewed"
            checked={isReviewed}
            onCheckedChange={(val) => handleReviewedChange(Boolean(val))}
            disabled={isPending}
          />
          <Label
            htmlFor="mark-reviewed"
            className="cursor-pointer text-sm font-medium"
          >
            Mark as reviewed
          </Label>
          {grade.humanAdjusted && (
            <span className="ml-auto text-xs text-muted-foreground">
              Human adjusted
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
