"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmissionNavProps {
  current: number;
  total: number;
  examId: string;
  submissionIds: string[];
  className?: string;
}

export function SubmissionNav({
  current,
  total,
  examId,
  submissionIds,
  className,
}: SubmissionNavProps) {
  const router = useRouter();

  const currentIndex = current - 1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < submissionIds.length - 1;

  function navigate(index: number) {
    const id = submissionIds[index];
    if (id) {
      router.push(`/exams/${examId}/submissions/${id}`);
    }
  }

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={!hasPrev}
        onClick={() => navigate(currentIndex - 1)}
      >
        <ChevronLeft className="size-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Submission{" "}
        <span className="font-semibold text-foreground">{current}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={!hasNext}
        onClick={() => navigate(currentIndex + 1)}
      >
        Next
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
