"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Clock } from "lucide-react";

export type ModelStatus = "waiting" | "analyzing" | "complete";

interface ModelCardProps {
  name: string;
  label: string;
  status: ModelStatus;
}

function ModelCard({ name, label, status }: ModelCardProps) {
  const config = {
    waiting: {
      icon: Clock,
      iconClass: "text-muted-foreground",
      bgClass: "bg-muted",
      statusText: "Waiting...",
      statusClass: "text-muted-foreground",
    },
    analyzing: {
      icon: Loader2,
      iconClass: "text-yellow-600 animate-spin",
      bgClass: "bg-yellow-100 dark:bg-yellow-900/20",
      statusText: "Analyzing...",
      statusClass: "text-yellow-600",
    },
    complete: {
      icon: CheckCircle2,
      iconClass: "text-green-600",
      bgClass: "bg-green-100 dark:bg-green-900/20",
      statusText: "Complete",
      statusClass: "text-green-600",
    },
  } as const;

  const { icon: Icon, iconClass, bgClass, statusText, statusClass } =
    config[status];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors",
        status === "complete" && "border-green-200 dark:border-green-900",
        status === "analyzing" && "border-yellow-200 dark:border-yellow-900"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          bgClass
        )}
      >
        <Icon className={cn("h-5 w-5", iconClass)} />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{name}</p>
        <p className="text-sm font-medium">{label}</p>
      </div>
      <span className={cn("text-xs font-medium", statusClass)}>
        {statusText}
      </span>
    </div>
  );
}

interface AutogradeProgressModalProps {
  open: boolean;
  progress: number;
  modelStatuses: {
    openai: ModelStatus;
    anthropic: ModelStatus;
    gemini: ModelStatus;
  };
  onClose?: () => void;
}

export function AutogradeProgressModal({
  open,
  progress,
  modelStatuses,
  onClose,
}: AutogradeProgressModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Autograding in Progress</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-semibold tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <ModelCard
              name="AI Model 1"
              label="ChatGPT"
              status={modelStatuses.openai}
            />
            <ModelCard
              name="AI Model 2"
              label="Claude"
              status={modelStatuses.anthropic}
            />
            <ModelCard
              name="AI Model 3"
              label="Gemini"
              status={modelStatuses.gemini}
            />
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Three independent AI models grade each response. Their scores are
            averaged to produce the most accurate and unbiased grade.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
