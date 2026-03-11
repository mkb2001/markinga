"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AiModel } from "@/types/database";

interface AiModelBadgeProps {
  model: AiModel | string;
  score: number;
  maxScore: number;
  className?: string;
}

const MODEL_STYLES: Record<string, string> = {
  OPENAI:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  ANTHROPIC:
    "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  GEMINI:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

const MODEL_LABELS: Record<string, string> = {
  OPENAI: "OpenAI",
  ANTHROPIC: "Anthropic",
  GEMINI: "Gemini",
};

export function AiModelBadge({
  model,
  score,
  maxScore,
  className,
}: AiModelBadgeProps) {
  const key = String(model).toUpperCase();
  const styleClass =
    MODEL_STYLES[key] ??
    "border-secondary bg-secondary/50 text-secondary-foreground";
  const label = MODEL_LABELS[key] ?? model;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 text-xs", styleClass, className)}
    >
      <span className="font-medium">{label}:</span>
      <span>
        {score}/{maxScore}
      </span>
    </Badge>
  );
}
