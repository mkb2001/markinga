"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { useTourStore } from "@/hooks/use-tour";
import { tourSteps, resolveRoute } from "@/config/tour-steps";
import { TourTooltip } from "@/components/tour/tour-tooltip";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TOOLTIP_OFFSET = 16;
const TOOLTIP_WIDTH = 320;
const TARGET_RETRY_INTERVAL = 200;
const TARGET_RETRY_MAX = 15; // 3 seconds max wait

function getTooltipPosition(
  rect: TargetRect,
  placement: "top" | "bottom" | "left" | "right"
): React.CSSProperties {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const vpWidth = window.innerWidth;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "bottom":
      top = rect.top + scrollY + rect.height + TOOLTIP_OFFSET;
      left = rect.left + scrollX + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case "top":
      top = rect.top + scrollY - TOOLTIP_OFFSET - 200;
      left = rect.left + scrollX + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case "right":
      top = rect.top + scrollY + rect.height / 2 - 100;
      left = rect.left + scrollX + rect.width + TOOLTIP_OFFSET;
      break;
    case "left":
      top = rect.top + scrollY + rect.height / 2 - 100;
      left = rect.left + scrollX - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
      break;
  }

  left = Math.max(8, Math.min(left, vpWidth - TOOLTIP_WIDTH - 8));
  top = Math.max(8 + scrollY, top);

  return {
    position: "absolute",
    top,
    left,
  };
}

export function TourStep() {
  const {
    isActive,
    currentStep,
    nextStep,
    prevStep,
    skipTour,
    demoExamId,
    demoSubmissionId,
  } = useTourStore();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = tourSteps[currentStep];

  const resolvedRoute = step?.route
    ? resolveRoute(step.route, demoExamId, demoSubmissionId)
    : null;

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;
  }, []);

  const measureTarget = useCallback(() => {
    if (!step) return false;
    const el = document.querySelector(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      return true;
    }
    setTargetRect(null);
    return false;
  }, [step]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle navigation when step route differs from current path
  useEffect(() => {
    if (!isActive || !step || !resolvedRoute) return;

    if (pathname !== resolvedRoute) {
      setReady(false);
      setTargetRect(null);
      router.push(resolvedRoute);
    }
  }, [isActive, step, resolvedRoute, pathname, router]);

  // After navigation (or on same page), retry finding target element
  useEffect(() => {
    if (!isActive || !step) return;

    // If we need to navigate and haven't arrived yet, wait
    if (resolvedRoute && pathname !== resolvedRoute) {
      setReady(false);
      return;
    }

    // We're on the right page — try to find target
    clearRetryTimer();

    const found = measureTarget();
    if (found) {
      setReady(true);
      return;
    }

    // Retry until found or max retries
    retryTimerRef.current = setInterval(() => {
      retryCountRef.current += 1;
      const found = measureTarget();
      if (found || retryCountRef.current >= TARGET_RETRY_MAX) {
        clearRetryTimer();
        setReady(true);
      }
    }, TARGET_RETRY_INTERVAL);

    return clearRetryTimer;
  }, [isActive, step, pathname, resolvedRoute, measureTarget, clearRetryTimer]);

  // Keep measuring on scroll/resize
  useEffect(() => {
    if (!isActive || !step || !ready) return;

    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);
    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
    };
  }, [isActive, step, ready, measureTarget]);

  if (!mounted || !isActive || !step || !ready) return null;

  const hasTarget = targetRect !== null;
  const tooltipStyle = hasTarget
    ? getTooltipPosition(targetRect, step.placement)
    : {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  return createPortal(
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/50"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      />

      {/* Highlight cutout — rendered via box-shadow */}
      {hasTarget && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: targetRect.top + window.scrollY - 4,
            left: targetRect.left + window.scrollX - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: 8,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
            zIndex: 10000,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Tooltip */}
      <TourTooltip
        title={step.title}
        description={step.description}
        currentStep={currentStep}
        totalSteps={tourSteps.length}
        placement={step.placement}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipTour}
        style={tooltipStyle as React.CSSProperties}
      />
    </>,
    document.body
  );
}
