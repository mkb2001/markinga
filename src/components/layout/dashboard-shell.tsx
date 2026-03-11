"use client";

import { TourProvider } from "@/components/tour/tour-provider";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <TourProvider>{children}</TourProvider>;
}
