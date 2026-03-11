"use client";

import { useState } from "react";

interface OcrState {
  isProcessing: boolean;
  text: string | null;
  confidence: number | null;
  error: string | null;
}

interface UseOcrReturn extends OcrState {
  processOcr: (submissionId: string) => Promise<void>;
  reset: () => void;
}

export function useOcr(): UseOcrReturn {
  const [state, setState] = useState<OcrState>({
    isProcessing: false,
    text: null,
    confidence: null,
    error: null,
  });

  const processOcr = async (submissionId: string) => {
    setState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "OCR processing failed");
      }

      const { text, confidence } = await response.json();
      setState({ isProcessing: false, text, confidence, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  };

  const reset = () => {
    setState({ isProcessing: false, text: null, confidence: null, error: null });
  };

  return { ...state, processOcr, reset };
}
