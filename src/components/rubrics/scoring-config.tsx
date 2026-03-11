"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ScoringType } from "@/types/database";

export interface ScoringConfigValues {
  totalPoints: number;
  scoringType: ScoringType;
  allowNegative: boolean;
}

interface ScoringConfigProps {
  values: ScoringConfigValues;
  onChange: (updated: ScoringConfigValues) => void;
  className?: string;
}

export function ScoringConfig({
  values,
  onChange,
  className,
}: ScoringConfigProps) {
  function handleTotalPointsChange(value: string) {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange({ ...values, totalPoints: parsed });
    }
  }

  function handleScoringTypeChange(value: string) {
    onChange({ ...values, scoringType: value as ScoringType });
  }

  function handleAllowNegativeChange(checked: boolean) {
    onChange({ ...values, allowNegative: checked });
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 shadow-xs",
        className
      )}
    >
      <h3 className="mb-4 text-sm font-semibold">Scoring Configuration</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Points */}
        <div className="space-y-1.5">
          <Label htmlFor="total-points" className="text-xs font-medium">
            Total Points
          </Label>
          <Input
            id="total-points"
            type="number"
            min={0}
            step={1}
            value={values.totalPoints}
            onChange={(e) => handleTotalPointsChange(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Scoring Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Scoring Type</Label>
          <Select
            value={values.scoringType}
            onValueChange={handleScoringTypeChange}
          >
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="POSITIVE">
                Positive (add marks)
              </SelectItem>
              <SelectItem value="NEGATIVE">
                Negative (deduct marks)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Allow Negative Scores */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Allow Negative Scores</Label>
          <div className="flex h-9 items-center gap-2">
            <Switch
              id="allow-negative"
              checked={values.allowNegative}
              onCheckedChange={handleAllowNegativeChange}
            />
            <Label
              htmlFor="allow-negative"
              className="cursor-pointer text-sm text-muted-foreground"
            >
              {values.allowNegative ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </div>
      </div>

      {values.scoringType === "NEGATIVE" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Negative scoring deducts marks for incorrect answers. Use with caution.
        </p>
      )}
    </div>
  );
}
