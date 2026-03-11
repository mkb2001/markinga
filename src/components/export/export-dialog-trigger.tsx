"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportDialog } from "./export-dialog";

interface ExportDialogTriggerProps {
  examId: string;
  examTitle: string;
}

export function ExportDialogTrigger({ examId, examTitle }: ExportDialogTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <ExportDialog
        examId={examId}
        examTitle={examTitle}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
