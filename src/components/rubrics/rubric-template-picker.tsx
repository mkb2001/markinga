"use client";

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  rubricTemplates,
  templatesByLevel,
  type RubricTemplate,
} from "@/config/rubric-templates";

interface RubricTemplatePickerProps {
  onSelectTemplate: (template: RubricTemplate) => void;
  className?: string;
}

const LEVEL_COLORS: Record<string, string> = {
  "O-Level":
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  "A-Level":
    "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  UPE: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400",
  USE: "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const LEVELS = Object.keys(templatesByLevel);

export function RubricTemplatePicker({
  onSelectTemplate,
  className,
}: RubricTemplatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const displayedTemplates = selectedLevel
    ? (templatesByLevel[selectedLevel] ?? [])
    : rubricTemplates;

  function handleSelect(template: RubricTemplate) {
    onSelectTemplate(template);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("gap-2", className)}
        >
          <BookOpen className="size-4" />
          Uganda Templates
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Uganda Curriculum Rubric Templates</DialogTitle>
        </DialogHeader>

        {/* Level filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedLevel === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLevel(null)}
          >
            All Levels
          </Button>
          {LEVELS.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLevel(level)}
            >
              {level}
            </Button>
          ))}
        </div>

        {/* Template cards */}
        <div className="grid max-h-[400px] gap-3 overflow-y-auto sm:grid-cols-2">
          {displayedTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template)}
              className="group flex flex-col items-start gap-2 rounded-lg border bg-card p-4 text-left shadow-xs transition-all hover:border-primary hover:shadow-sm"
            >
              <div className="flex w-full items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground text-sm leading-tight">
                    {template.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {template.subject}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-xs",
                    LEVEL_COLORS[template.level] ?? ""
                  )}
                >
                  {template.level}
                </Badge>
              </div>

              <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
                <span>{template.criteria.length} criteria</span>
                <span className="font-medium">{template.totalPoints} pts</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.criteria.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {c.name}
                  </span>
                ))}
                {template.criteria.length > 3 && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    +{template.criteria.length - 3} more
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
