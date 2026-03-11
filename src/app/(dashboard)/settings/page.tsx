"use client";

import { useState } from "react";
import { useInstitutionMode } from "@/hooks/use-institution-mode";
import { useTourStore } from "@/hooks/use-tour";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  Building2,
  Brain,
  PlayCircle,
  School,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InstitutionType } from "@/types/database";

type AiModelKey = "openai" | "anthropic" | "gemini";

const AI_MODELS: { key: AiModelKey; label: string; description: string }[] = [
  {
    key: "openai",
    label: "OpenAI (GPT-4o)",
    description: "Strong general-purpose reasoning and structured output.",
  },
  {
    key: "anthropic",
    label: "Anthropic (Claude)",
    description: "Excellent at nuanced understanding and lengthy text.",
  },
  {
    key: "gemini",
    label: "Google (Gemini)",
    description: "Multimodal support for image-based exam papers.",
  },
];

export default function SettingsPage() {
  const { institutionType, institutionName, setInstitution } =
    useInstitutionMode();
  const { startTour } = useTourStore();

  // Profile state (client-only demo — real save would call an API)
  const [fullName, setFullName] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // Institution state
  const [selectedType, setSelectedType] = useState<InstitutionType | null>(
    institutionType
  );
  const [instName, setInstName] = useState(institutionName);

  // AI model preferences
  const [aiModels, setAiModels] = useState<Record<AiModelKey, boolean>>({
    openai: true,
    anthropic: true,
    gemini: true,
  });

  function handleSaveProfile() {
    setProfileSaved(true);
    toast.success("Profile updated successfully.");
  }

  function handleSaveInstitution() {
    if (!selectedType) {
      toast.error("Please select an institution type.");
      return;
    }
    setInstitution(selectedType, instName);
    toast.success("Institution settings saved.");
  }

  function handleSaveAiModels() {
    const active = Object.entries(aiModels).filter(([, v]) => v);
    if (active.length === 0) {
      toast.error("At least one AI model must be selected.");
      return;
    }
    toast.success("AI model preferences saved.");
  }

  function handleRestartTour() {
    startTour();
    toast.info("Tour started. Navigate to the dashboard to begin.");
  }

  function toggleModel(key: AiModelKey) {
    setAiModels((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, institution, and app preferences."
      />

      {/* ── Profile ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-5 text-muted-foreground" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>
            Update your display name and view your account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              Avatar is generated from your initials.
            </p>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setProfileSaved(false);
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Managed by your account"
                disabled
                readOnly
                className="cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={profileSaved}>
              {profileSaved ? "Saved" : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Institution ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-muted-foreground" />
            <CardTitle>Institution</CardTitle>
          </div>
          <CardDescription>
            Switch between Primary/Secondary and University modes to tailor
            grading rubrics and grade boundaries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSelectedType("PRIMARY_SECONDARY")}
              className={cn(
                "flex flex-col items-center gap-3 rounded-lg border-2 p-5 transition-colors hover:border-primary text-left",
                selectedType === "PRIMARY_SECONDARY"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <School className="size-9 text-primary" />
              <div>
                <p className="font-semibold text-sm">Primary / Secondary</p>
                <p className="text-xs text-muted-foreground">
                  UPE, USE, O-Level, A-Level
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedType("UNIVERSITY")}
              className={cn(
                "flex flex-col items-center gap-3 rounded-lg border-2 p-5 transition-colors hover:border-primary text-left",
                selectedType === "UNIVERSITY"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <GraduationCap className="size-9 text-primary" />
              <div>
                <p className="font-semibold text-sm">University</p>
                <p className="text-xs text-muted-foreground">
                  Higher education grading
                </p>
              </div>
            </button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="inst-name">Institution Name (optional)</Label>
            <Input
              id="inst-name"
              placeholder="e.g. Makerere University"
              value={instName}
              onChange={(e) => setInstName(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveInstitution}>Save Institution</Button>
          </div>
        </CardContent>
      </Card>

      {/* ── AI Model Preferences ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-muted-foreground" />
            <CardTitle>AI Model Preferences</CardTitle>
          </div>
          <CardDescription>
            Choose which AI models are used during autograding. Selecting
            multiple models increases accuracy through consensus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-4">
            {AI_MODELS.map((model) => (
              <div key={model.key} className="flex items-start gap-3">
                <Checkbox
                  id={`model-${model.key}`}
                  checked={aiModels[model.key]}
                  onCheckedChange={() => toggleModel(model.key)}
                  className="mt-0.5"
                />
                <div className="grid gap-0.5">
                  <Label
                    htmlFor={`model-${model.key}`}
                    className="cursor-pointer font-medium"
                  >
                    {model.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {model.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                {Object.values(aiModels).filter(Boolean).length} model
                {Object.values(aiModels).filter(Boolean).length !== 1
                  ? "s"
                  : ""}{" "}
                selected
              </p>
              <p className="text-xs text-muted-foreground">
                At least one model must be active.
              </p>
            </div>
            <Button onClick={handleSaveAiModels}>Save Preferences</Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Tour ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PlayCircle className="size-5 text-muted-foreground" />
            <CardTitle>Guided Tour</CardTitle>
          </div>
          <CardDescription>
            New to Markinga? Restart the interactive tour to walk through all
            key features step-by-step.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleRestartTour}>
            <PlayCircle className="mr-2 size-4" />
            Restart Tour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
