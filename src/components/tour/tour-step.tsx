"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTourStore } from "@/hooks/use-tour";
import { tourSteps } from "@/config/tour-steps";
import { TourTooltip } from "@/components/tour/tour-tooltip";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TOOLTIP_OFFSET = 16;
const TOOLTIP_WIDTH = 320;

function getTooltipPosition(
  rect: TargetRect,
  placement: "top" | "bottom" | "left" | "right"
): React.CSSProperties {
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;
  const vpWidth = window.innerWidth;
  const vpHeight = window.innerHeight;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "bottom":
      top = rect.top + scrollY + rect.height + TOOLTIP_OFFSET;
      left = rect.left + scrollX + rect.width / 2 - TOOLTIP_WIDTH / 2;
      break;
    case "top":
      top = rect.top + scrollY - TOOLTIP_OFFSET - 200; // estimated tooltip height
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

  // Clamp within viewport
  left = Math.max(8, Math.min(left, vpWidth - TOOLTIP_WIDTH - 8));
  top = Math.max(8 + scrollY, top);

  return {
    position: "absolute",
    top,
    left,
  };
}

export function TourStep() {
  const { isActive, currentStep, nextStep, prevStep, skipTour } = useTourStore();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [mounted, setMounted] = useState(false);

  const step = tourSteps[currentStep];

  const measureTarget = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isActive || !step) return;
    measureTarget();
    window.addEventListener("resize", measureTarget);
    window.addEventListener("scroll", measureTarget, true);
    return () => {
      window.removeEventListener("resize", measureTarget);
      window.removeEventListener("scroll", measureTarget, true);
    };
  }, [isActive, step, measureTarget]);

  if (!mounted || !isActive || !step) return null;

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
