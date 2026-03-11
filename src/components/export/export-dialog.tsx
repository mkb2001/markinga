"use client";

import { useState } from "react";
import { Download, FileText, Table } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExportDialogProps {
  examId: string;
  examTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportFormat = "csv" | "pdf";

export function ExportDialog({
  examId,
  examTitle,
  open,
  onOpenChange,
}: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(format);
    try {
      const url = `/api/export/${format}?examId=${examId}`;
      const response = await fetch(url);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Failed to export ${format.toUpperCase()}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${examTitle.replace(/[^a-z0-9]/gi, "_")}_results.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      toast.success(`Results exported as ${format.toUpperCase()}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Results</DialogTitle>
          <DialogDescription>
            Choose a format to export the exam results for{" "}
            <span className="font-medium">{examTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            onClick={() => handleExport("csv")}
            disabled={isExporting !== null}
            className={cn(
              "flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors",
              "hover:border-primary hover:bg-primary/5",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isExporting === "csv" && "border-primary bg-primary/5"
            )}
          >
            <Table className="h-8 w-8 text-green-600" />
            <div className="text-center">
              <p className="font-medium">CSV</p>
              <p className="text-xs text-muted-foreground">
                Spreadsheet format
              </p>
            </div>
            {isExporting === "csv" && (
              <p className="text-xs text-primary">Exporting...</p>
            )}
          </button>

          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting !== null}
            className={cn(
              "flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors",
              "hover:border-primary hover:bg-primary/5",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isExporting === "pdf" && "border-primary bg-primary/5"
            )}
          >
            <FileText className="h-8 w-8 text-red-600" />
            <div className="text-center">
              <p className="font-medium">PDF</p>
              <p className="text-xs text-muted-foreground">
                Printable report
              </p>
            </div>
            {isExporting === "pdf" && (
              <p className="text-xs text-primary">Exporting...</p>
            )}
          </button>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting !== null}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
