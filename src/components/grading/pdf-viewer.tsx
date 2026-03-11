"use client";

import { useState } from "react";
import {
  ArrowDown,
  RotateCw,
  ZoomOut,
  ZoomIn,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PdfViewerProps {
  fileUrl: string;
  fileType: string;
  className?: string;
}

export function PdfViewer({ fileUrl, fileType, className }: PdfViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  const isImage = fileType === "IMAGE" || fileType === "IMAGES";

  function handleRotate() {
    setRotation((prev) => (prev + 90) % 360);
  }

  function handleZoomIn() {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }

  function handleZoomOut() {
    setZoom((prev) => Math.max(prev - 0.25, 0.25));
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileUrl.split("/").pop() ?? "submission";
    link.click();
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-muted/20",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex shrink-0 items-center gap-1 border-b bg-background px-3 py-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDownload}
          title="Download file"
        >
          <ArrowDown className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleRotate}
          title="Rotate 90°"
        >
          <RotateCw className="size-4" />
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          title="Zoom out"
        >
          <ZoomOut className="size-4" />
        </Button>
        <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          title="Zoom in"
        >
          <ZoomIn className="size-4" />
        </Button>
      </div>

      {/* Viewer area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex min-h-full items-start justify-center">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl}
              alt="Submission"
              className="max-w-full object-contain shadow-md transition-transform"
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: "center top",
              }}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-background p-12 text-center shadow-sm"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center top" }}
            >
              <FileText className="size-16 text-muted-foreground/50" />
              <div>
                <p className="font-semibold text-foreground">PDF Document</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  PDF rendering requires the{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
                    react-pdf
                  </code>{" "}
                  package.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Install with:{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono">
                    npm install react-pdf
                  </code>
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <ArrowDown className="size-4" />
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
