import { create } from "zustand";
import { persist } from "zustand/middleware";
import { tourSteps } from "@/config/tour-steps";

interface TourState {
  isActive: boolean;
  currentStep: number;
  completedSteps: string[];
  hasCompletedTour: boolean;
  demoExamId: string | null;
  demoSubmissionId: string | null;

  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  setDemoData: (examId: string, submissionId: string) => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      isActive: false,
      currentStep: 0,
      completedSteps: [],
      hasCompletedTour: false,
      demoExamId: null,
      demoSubmissionId: null,

      startTour: () =>
        set({
          isActive: true,
          currentStep: 0,
        }),

      nextStep: () => {
        const { currentStep, completedSteps } = get();
        const currentStepData = tourSteps[currentStep];
        const updatedCompleted = currentStepData
          ? Array.from(new Set([...completedSteps, currentStepData.id]))
          : completedSteps;

        if (currentStep >= tourSteps.length - 1) {
          set({
            isActive: false,
            currentStep: 0,
            completedSteps: updatedCompleted,
            hasCompletedTour: true,
          });
        } else {
          set({
            currentStep: currentStep + 1,
            completedSteps: updatedCompleted,
          });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      skipTour: () =>
        set({
          isActive: false,
          currentStep: 0,
          hasCompletedTour: true,
        }),

      completeTour: () =>
        set({
          isActive: false,
          currentStep: 0,
          hasCompletedTour: true,
        }),

      setDemoData: (examId: string, submissionId: string) =>
        set({
          demoExamId: examId,
          demoSubmissionId: submissionId,
        }),
    }),
    {
      name: "markinga-tour",
      partialize: (state) => ({
        completedSteps: state.completedSteps,
        hasCompletedTour: state.hasCompletedTour,
        demoExamId: state.demoExamId,
        demoSubmissionId: state.demoSubmissionId,
      }),
    }
  )
);
