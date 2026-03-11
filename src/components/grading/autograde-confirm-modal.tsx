"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface AutogradeConfirmModalProps {
  open: boolean;
  questionCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function AutogradeConfirmModal({
  open,
  questionCount,
  onCancel,
  onConfirm,
}: AutogradeConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Start Autograding?</DialogTitle>
          </div>
          <DialogDescription className="pt-1">
            This will start autograding for{" "}
            <span className="font-semibold text-foreground">
              {questionCount} question{questionCount !== 1 ? "s" : ""}
            </span>
            . You can continue working while grading runs in the background.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Three AI models (ChatGPT, Claude, and Gemini) will independently grade
          each response and their scores will be averaged for greater accuracy.
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <Bot className="h-4 w-4" />
            Start Autograding
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
