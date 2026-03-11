"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  autogradedPercent: number;
  reviewedPercent: number;
  className?: string;
}

export function ProgressBar({
  autogradedPercent,
  reviewedPercent,
  className,
}: ProgressBarProps) {
  const clampedAutograded = Math.min(100, Math.max(0, autogradedPercent));
  const clampedReviewed = Math.min(100, Math.max(0, reviewedPercent));

  return (
    <div className={cn("flex flex-col gap-1 min-w-[100px]", className)}>
      <div className="flex items-center gap-1.5">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-green-500 transition-all"
            style={{ width: `${clampedAutograded}%` }}
          />
        </div>
        <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
          {Math.round(clampedAutograded)}%
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-blue-500 transition-all"
            style={{ width: `${clampedReviewed}%` }}
          />
        </div>
        <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
          {Math.round(clampedReviewed)}%
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-2 rounded-full bg-green-500" />
          Graded
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-2 rounded-full bg-blue-500" />
          Reviewed
        </span>
      </div>
    </div>
  );
}
