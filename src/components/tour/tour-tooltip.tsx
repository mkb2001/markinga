"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TourTooltipProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  placement: "top" | "bottom" | "left" | "right";
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  style?: React.CSSProperties;
}

export function TourTooltip({
  title,
  description,
  currentStep,
  totalSteps,
  placement,
  onNext,
  onPrev,
  onSkip,
  style,
}: TourTooltipProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const arrowClasses: Record<typeof placement, string> = {
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-card border-l-transparent border-r-transparent border-t-transparent",
    top: "top-full left-1/2 -translate-x-1/2 border-t-card border-l-transparent border-r-transparent border-b-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-card border-t-transparent border-b-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-card border-t-transparent border-b-transparent border-l-transparent",
  };

  return (
    <div
      className={cn(
        "relative z-[10001] w-80 rounded-xl border bg-card p-5 shadow-xl text-card-foreground"
      )}
      style={style}
      role="dialog"
      aria-modal="false"
      aria-label={`Tour step ${currentStep + 1} of ${totalSteps}: ${title}`}
    >
      {/* Arrow */}
      <div
        className={cn(
          "absolute h-0 w-0 border-8",
          arrowClasses[placement]
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm leading-snug">{title}</h3>
        <button
          onClick={onSkip}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Skip tour"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground tabular-nums">
          {currentStep + 1} of {totalSteps}
        </span>

        <div className="flex items-center gap-2">
          {!isFirst && (
            <Button variant="outline" size="sm" onClick={onPrev}>
              Previous
            </Button>
          )}
          <Button size="sm" onClick={onNext}>
            {isLast ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
