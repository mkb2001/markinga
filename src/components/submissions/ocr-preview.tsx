"use client";

import { useState } from "react";
import { Save, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OcrPreviewProps {
  submissionId: string;
  initialText: string;
  confidence: number;
  onSave?: (text: string) => void;
}

function getConfidenceVariant(confidence: number): "default" | "secondary" | "destructive" | "outline" {
  if (confidence >= 80) return "default";
  if (confidence >= 60) return "secondary";
  return "destructive";
}

export function OcrPreview({
  submissionId,
  initialText,
  confidence,
  onSave,
}: OcrPreviewProps) {
  const [text, setText] = useState(initialText);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleTextChange = (value: string) => {
    setText(value);
    setIsDirty(value !== initialText);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/submissions/${submissionId}/ocr-text`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocrText: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to save OCR text");
      }

      setIsDirty(false);
      onSave?.(text);
      toast.success("OCR text saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">OCR Extracted Text</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Confidence:</span>
          <Badge
            variant={getConfidenceVariant(confidence)}
            className={cn(
              confidence >= 80 && "bg-green-500 text-white",
              confidence >= 60 && confidence < 80 && "bg-yellow-500 text-white"
            )}
          >
            {confidence.toFixed(1)}%
          </Badge>
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        className="min-h-[300px] font-mono text-sm"
        placeholder="No OCR text available..."
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </p>
        <Button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          size="sm"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
