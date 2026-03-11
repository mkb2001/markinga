"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ConfidenceLevel } from "@/types/database";

interface ConfidenceIndicatorProps {
  confidenceLevel: ConfidenceLevel;
  confidenceScore?: number | null;
  className?: string;
}

export function ConfidenceIndicator({
  confidenceLevel,
  confidenceScore,
  className,
}: ConfidenceIndicatorProps) {
  const isHigh = confidenceLevel === "HIGH";

  return (
    <Badge
      className={cn(
        "text-xs font-medium",
        isHigh
          ? "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        className
      )}
      variant="outline"
    >
      {isHigh ? "High Confidence" : "Low Confidence"}
      {confidenceScore !== null && confidenceScore !== undefined && (
        <span className="ml-1 opacity-70">
          ({Math.round(confidenceScore * 100)}%)
        </span>
      )}
    </Badge>
  );
}
