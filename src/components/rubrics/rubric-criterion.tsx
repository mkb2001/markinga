"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RubricCriterionTemplate, RubricLevel } from "@/config/rubric-templates";

export interface CriterionData {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
}

interface RubricCriterionProps {
  criterion: CriterionData;
  index: number;
  onChange: (updated: CriterionData) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function RubricCriterion({
  criterion,
  index,
  onChange,
  onRemove,
  className,
}: RubricCriterionProps) {
  function handleNameChange(value: string) {
    onChange({ ...criterion, name: value });
  }

  function handleDescriptionChange(value: string) {
    onChange({ ...criterion, description: value });
  }

  function handleLevelChange(
    levelIndex: number,
    field: keyof RubricLevel,
    value: string | number
  ) {
    const updatedLevels = criterion.levels.map((level, i) =>
      i === levelIndex ? { ...level, [field]: value } : level
    );
    onChange({ ...criterion, levels: updatedLevels });
  }

  function handleAddLevel() {
    const newLevel: RubricLevel = {
      label: "New Level",
      points: 0,
      description: "",
    };
    onChange({ ...criterion, levels: [...criterion.levels, newLevel] });
  }

  function handleRemoveLevel(levelIndex: number) {
    const updatedLevels = criterion.levels.filter((_, i) => i !== levelIndex);
    onChange({ ...criterion, levels: updatedLevels });
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm",
        className
      )}
    >
      {/* Criterion header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {index + 1}
        </div>
        <div className="flex flex-1 gap-3">
          <Input
            value={criterion.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Criterion name"
            className="h-8 flex-1 text-sm font-medium"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(criterion.id)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
            title="Remove criterion"
          >
            ×
          </Button>
        </div>
      </div>

      <Textarea
        value={criterion.description}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        placeholder="Describe what this criterion measures..."
        className="mb-4 resize-none text-sm"
        rows={2}
      />

      {/* Level buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Performance Levels
        </p>
        <div className="flex flex-wrap gap-2">
          {criterion.levels.map((level, levelIndex) => (
            <div
              key={levelIndex}
              className="group relative flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-1 rounded-md border bg-background px-2 py-1">
                <Input
                  value={level.label}
                  onChange={(e) =>
                    handleLevelChange(levelIndex, "label", e.target.value)
                  }
                  className="h-6 w-20 border-0 bg-transparent p-0 text-center text-xs font-medium focus-visible:ring-0"
                  placeholder="Label"
                />
                <Input
                  type="number"
                  value={level.points}
                  onChange={(e) =>
                    handleLevelChange(
                      levelIndex,
                      "points",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="h-6 w-10 border-0 bg-transparent p-0 text-center text-xs focus-visible:ring-0"
                  placeholder="pts"
                />
                <span className="text-xs text-muted-foreground">pts</span>
                {criterion.levels.length > 1 && (
                  <button
                    onClick={() => handleRemoveLevel(levelIndex)}
                    className="ml-0.5 hidden text-xs text-muted-foreground hover:text-destructive group-hover:block"
                    title="Remove level"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="xs"
            onClick={handleAddLevel}
            className="h-8 text-xs"
          >
            + Add Level
          </Button>
        </div>
      </div>
    </div>
  );
}
