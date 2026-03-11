"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInstitutionMode } from "@/hooks/use-institution-mode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTourStore } from "@/hooks/use-tour";
import type { InstitutionType } from "@/types/database";

export function OnboardingWrapper() {
  const [open, setOpen] = useState(true);
  const [selectedType, setSelectedType] = useState<InstitutionType | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { setInstitution } = useInstitutionMode();
  const { setDemoData, startTour } = useTourStore();
  const router = useRouter();

  async function handleSubmit() {
    if (!selectedType) return;
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionType: selectedType,
          institutionName: name,
        }),
      });
      setInstitution(selectedType, name);

      // Seed demo data for the guided tour
      try {
        const seedRes = await fetch("/api/tour/seed", { method: "POST" });
        const seedData = await seedRes.json();
        if (seedData.examId && seedData.submissionId) {
          setDemoData(seedData.examId, seedData.submissionId);
        }
      } catch {
        // Tour seed failed — continue without tour
      }

      setOpen(false);
      router.refresh();
      startTour();
    } catch {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to Markinga UG</DialogTitle>
          <DialogDescription>
            Select your institution type to customize your grading experience.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <button
            onClick={() => setSelectedType("PRIMARY_SECONDARY")}
            className={cn(
              "flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors hover:border-primary",
              selectedType === "PRIMARY_SECONDARY"
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <School className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold">Primary / Secondary</p>
              <p className="text-xs text-muted-foreground">
                UPE, USE, O-Level, A-Level
              </p>
            </div>
          </button>

          <button
            onClick={() => setSelectedType("UNIVERSITY")}
            className={cn(
              "flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-colors hover:border-primary",
              selectedType === "UNIVERSITY"
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <GraduationCap className="h-10 w-10 text-primary" />
            <div className="text-center">
              <p className="font-semibold">University</p>
              <p className="text-xs text-muted-foreground">
                Higher education grading
              </p>
            </div>
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution-name">
            Institution Name (optional)
          </Label>
          <Input
            id="institution-name"
            placeholder="e.g. Makerere University"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <Button
          size="lg"
          className="w-full mt-4"
          disabled={!selectedType || saving}
          onClick={handleSubmit}
        >
          {saving ? "Setting up..." : "Continue"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
