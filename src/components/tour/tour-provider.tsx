"use client";

import { TourStep } from "@/components/tour/tour-step";

interface TourProviderProps {
  children: React.ReactNode;
}

export function TourProvider({ children }: TourProviderProps) {
  return (
    <>
      {children}
      <TourStep />
    </>
  );
}
