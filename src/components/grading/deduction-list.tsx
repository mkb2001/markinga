"use client";

import { cn } from "@/lib/utils";

export interface Deduction {
  reason: string;
  marks: number;
}

interface DeductionListProps {
  deductions: Deduction[];
  className?: string;
}

export function DeductionList({ deductions, className }: DeductionListProps) {
  if (!deductions || deductions.length === 0) {
    return (
      <div className={cn("rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground", className)}>
        No deductions recorded.
      </div>
    );
  }

  return (
    <ol className={cn("space-y-2", className)}>
      {deductions.map((deduction, index) => (
        <li
          key={index}
          className="flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-xs font-semibold text-destructive">
            {index + 1}
          </span>
          <span className="flex-1 text-foreground">{deduction.reason}</span>
          <span className="shrink-0 font-medium text-destructive">
            -{deduction.marks} {deduction.marks === 1 ? "mark" : "marks"}
          </span>
        </li>
      ))}
    </ol>
  );
}
