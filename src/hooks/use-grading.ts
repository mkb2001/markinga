"use client";

import { useState, useCallback, useRef } from "react";
import type { ModelStatus } from "@/components/grading/autograde-progress-modal";

type GradingPhase = "idle" | "confirming" | "grading" | "complete";

interface ModelStatuses {
  openai: ModelStatus;
  anthropic: ModelStatus;
  gemini: ModelStatus;
}

interface GradingSummary {
  totalGraded: number;
  averageScore: number;
  highConfidenceCount: number;
  lowConfidenceCount: number;
}

interface UseGradingReturn {
  isGrading: boolean;
  progress: number;
  phase: GradingPhase;
  modelStatuses: ModelStatuses;
  summary: GradingSummary | null;
  currentExamId: string | null;
  initiateGrading: (examId: string) => void;
  confirmGrading: () => Promise<void>;
  cancelGrading: () => void;
  dismissComplete: () => void;
}

const INITIAL_MODEL_STATUSES: ModelStatuses = {
  openai: "waiting",
  anthropic: "waiting",
  gemini: "waiting",
};

export function useGrading(): UseGradingReturn {
  const [phase, setPhase] = useState<GradingPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [modelStatuses, setModelStatuses] = useState<ModelStatuses>(
    INITIAL_MODEL_STATUSES
  );
  const [summary, setSummary] = useState<GradingSummary | null>(null);
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  async function pollProgress(jobId: string) {
    stopPolling();

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/grade/status?jobId=${jobId}`);
        if (!res.ok) return;

        const data = await res.json();

        setProgress(data.progress ?? 0);

        if (data.modelStatuses) {
          setModelStatuses(data.modelStatuses);
        }

        if (data.status === "complete") {
          stopPolling();
          setProgress(100);
          setModelStatuses({ openai: "complete", anthropic: "complete", gemini: "complete" });
          setSummary(
            data.summary ?? {
              totalGraded: 0,
              averageScore: 0,
              highConfidenceCount: 0,
              lowConfidenceCount: 0,
            }
          );
          setPhase("complete");
        } else if (data.status === "failed") {
          stopPolling();
          setPhase("idle");
        }
      } catch {
        // Network error — keep polling
      }
    }, 2000);
  }

  function initiateGrading(examId: string) {
    setCurrentExamId(examId);
    setPhase("confirming");
  }

  async function confirmGrading() {
    if (!currentExamId) return;

    setPhase("grading");
    setProgress(0);
    setModelStatuses(INITIAL_MODEL_STATUSES);
    setSummary(null);

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: currentExamId }),
      });

      if (!res.ok) {
        setPhase("idle");
        return;
      }

      const data = await res.json();
      const jobId: string = data.jobId;

      await pollProgress(jobId);
    } catch {
      setPhase("idle");
    }
  }

  function cancelGrading() {
    stopPolling();
    setPhase("idle");
    setCurrentExamId(null);
    setProgress(0);
    setModelStatuses(INITIAL_MODEL_STATUSES);
  }

  function dismissComplete() {
    stopPolling();
    setPhase("idle");
    setCurrentExamId(null);
    setProgress(0);
    setModelStatuses(INITIAL_MODEL_STATUSES);
    setSummary(null);
  }

  return {
    isGrading: phase === "grading",
    progress,
    phase,
    modelStatuses,
    summary,
    currentExamId,
    initiateGrading,
    confirmGrading,
    cancelGrading,
    dismissComplete,
  };
}
