"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, ShieldCheck, AlertTriangle } from "lucide-react";

interface AutogradeCompleteModalProps {
  open: boolean;
  summary: {
    totalGraded: number;
    averageScore: number;
    highConfidenceCount: number;
    lowConfidenceCount: number;
  };
  onClose: () => void;
  onReviewGrades: () => void;
}

interface SummaryItemProps {
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
  label: string;
  value: string | number;
}

function SummaryItem({
  icon: Icon,
  iconClass,
  bgClass,
  label,
  value,
}: SummaryItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${bgClass}`}
      >
        <Icon className={`h-4 w-4 ${iconClass}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

export function AutogradeCompleteModal({
  open,
  summary,
  onClose,
  onReviewGrades,
}: AutogradeCompleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3 pb-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Grading Complete!</DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Ready to review grades
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <SummaryItem
            icon={CheckCircle2}
            iconClass="text-green-600"
            bgClass="bg-green-100 dark:bg-green-900/20"
            label="Total Graded"
            value={summary.totalGraded}
          />
          <SummaryItem
            icon={TrendingUp}
            iconClass="text-blue-600"
            bgClass="bg-blue-100 dark:bg-blue-900/20"
            label="Average Score"
            value={`${Math.round(summary.averageScore)}%`}
          />
          <SummaryItem
            icon={ShieldCheck}
            iconClass="text-violet-600"
            bgClass="bg-violet-100 dark:bg-violet-900/20"
            label="High Confidence"
            value={summary.highConfidenceCount}
          />
          <SummaryItem
            icon={AlertTriangle}
            iconClass="text-amber-600"
            bgClass="bg-amber-100 dark:bg-amber-900/20"
            label="Low Confidence"
            value={summary.lowConfidenceCount}
          />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Low confidence grades are flagged for manual review. We recommend
          checking those first.
        </p>

        <DialogFooter className="sm:flex-col sm:gap-2">
          <Button className="w-full" onClick={onReviewGrades}>
            Review Grades
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
