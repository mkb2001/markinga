"use client";

import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  maxScore: number;
  className?: string;
}

export function ScoreBadge({ score, maxScore, className }: ScoreBadgeProps) {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  const colorClass =
    percentage >= 75
      ? "border-green-500 text-green-600"
      : percentage >= 50
        ? "border-yellow-500 text-yellow-600"
        : "border-red-500 text-red-600";

  return (
    <div
      className={cn(
        "flex h-24 w-24 flex-col items-center justify-center rounded-full border-4",
        colorClass,
        className
      )}
    >
      <span className="text-2xl font-bold leading-none">{score}</span>
      <span className="mt-0.5 text-xs font-medium text-muted-foreground">
        / {maxScore}
      </span>
    </div>
  );
}
