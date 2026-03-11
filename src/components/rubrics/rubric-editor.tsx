"use client";

import { useState, useCallback } from "react";
import { Sparkles, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RubricCriterion, type CriterionData } from "@/components/rubrics/rubric-criterion";
import { ScoringConfig, type ScoringConfigValues } from "@/components/rubrics/scoring-config";
import { RubricTemplatePicker } from "@/components/rubrics/rubric-template-picker";
import { cn } from "@/lib/utils";
import type { RubricTemplate } from "@/config/rubric-templates";
import type { Question, ScoringType } from "@/types/database";

interface RubricEditorProps {
  examId: string;
  questions: Pick<Question, "id" | "questionNumber" | "questionText" | "maxMarks">[];
  initialCriteria?: CriterionData[];
  initialScoring?: ScoringConfigValues;
  onSave?: (data: RubricEditorData) => Promise<void>;
  className?: string;
}

export interface RubricEditorData {
  questionId: string | null;
  criteria: CriterionData[];
  scoring: ScoringConfigValues;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_SCORING: ScoringConfigValues = {
  totalPoints: 100,
  scoringType: "POSITIVE",
  allowNegative: false,
};

const EMPTY_CRITERION: () => CriterionData = () => ({
  id: generateId(),
  name: "New Criterion",
  description: "",
  levels: [
    { label: "Excellent", points: 4, description: "Outstanding performance" },
    { label: "Good", points: 3, description: "Solid performance" },
    { label: "Fair", points: 2, description: "Adequate performance" },
    { label: "Poor", points: 1, description: "Below expectations" },
    { label: "None", points: 0, description: "No attempt" },
  ],
});

export function RubricEditor({
  examId,
  questions,
  initialCriteria,
  initialScoring,
  onSave,
  className,
}: RubricEditorProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("all");
  const [criteria, setCriteria] = useState<CriterionData[]>(
    initialCriteria ?? []
  );
  const [scoring, setScoring] = useState<ScoringConfigValues>(
    initialScoring ?? DEFAULT_SCORING
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCriterionChange = useCallback(
    (updated: CriterionData) => {
      setCriteria((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    },
    []
  );

  const handleCriterionRemove = useCallback((id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
  }, []);

  function handleAddCriterion() {
    setCriteria((prev) => [...prev, EMPTY_CRITERION()]);
  }

  function handleLoadTemplate(template: RubricTemplate) {
    const newCriteria: CriterionData[] = template.criteria.map((c) => ({
      id: generateId(),
      name: c.name,
      description: c.description,
      levels: c.levels,
    }));
    setCriteria(newCriteria);
    setScoring({
      totalPoints: template.totalPoints,
      scoringType: template.scoringType,
      allowNegative: false,
    });
  }

  async function handleGenerateAll() {
    setIsGenerating(true);
    try {
      // TODO: integrate with AI generation API
      await new Promise((r) => setTimeout(r, 1500));
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave({
        questionId: selectedQuestionId === "all" ? null : selectedQuestionId,
        criteria,
        scoring,
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b bg-background px-4 py-3">
        {/* Problem selector */}
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium whitespace-nowrap">
            Select Problem:
          </Label>
          <Select
            value={selectedQuestionId}
            onValueChange={setSelectedQuestionId}
          >
            <SelectTrigger className="h-9 min-w-[180px]">
              <SelectValue placeholder="All Problems" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Problems</SelectItem>
              {questions.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  Q{q.questionNumber}:{" "}
                  {q.questionText.length > 30
                    ? q.questionText.slice(0, 30) + "…"
                    : q.questionText}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
          <RubricTemplatePicker onSelectTemplate={handleLoadTemplate} />

          <Button
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
          >
            <Sparkles className="size-4" />
            {isGenerating ? "Generating…" : "Generate All Rubrics and Solutions"}
          </Button>

          {onSave && (
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              <Save className="size-4" />
              {isSaving ? "Saving…" : "Save"}
            </Button>
          )}
        </div>
      </div>

      {/* Criteria list */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-3">
          {criteria.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <p className="font-semibold text-muted-foreground">
                No criteria yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add criteria manually or load a Uganda curriculum template.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={handleAddCriterion}
              >
                <Plus className="size-4" />
                Add First Criterion
              </Button>
            </div>
          )}

          {criteria.map((criterion, index) => (
            <RubricCriterion
              key={criterion.id}
              criterion={criterion}
              index={index}
              onChange={handleCriterionChange}
              onRemove={handleCriterionRemove}
            />
          ))}

          {criteria.length > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAddCriterion}
            >
              <Plus className="size-4" />
              Add Criterion
            </Button>
          )}
        </div>
      </ScrollArea>

      {/* Scoring config footer */}
      <div className="shrink-0 border-t bg-background px-4 py-3">
        <ScoringConfig values={scoring} onChange={setScoring} />
      </div>
    </div>
  );
}
