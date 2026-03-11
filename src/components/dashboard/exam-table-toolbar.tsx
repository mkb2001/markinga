"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bot, UserCheck, Users } from "lucide-react";
import { useState } from "react";

interface ExamTableToolbarProps {
  selectedIds: string[];
  onAutogradeSelected: () => void;
  onAutogradeAll: () => void;
}

export function ExamTableToolbar({
  selectedIds,
  onAutogradeSelected,
  onAutogradeAll,
}: ExamTableToolbarProps) {
  const [gradesPublished, setGradesPublished] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        <Switch
          id="grades-published"
          checked={gradesPublished}
          onCheckedChange={setGradesPublished}
        />
        <Label htmlFor="grades-published" className="cursor-pointer text-sm">
          Grades Published
        </Label>
      </div>

      <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

      <Button
        variant={showOnlyMine ? "secondary" : "ghost"}
        size="sm"
        onClick={() => setShowOnlyMine((v) => !v)}
        className="gap-1.5"
      >
        <UserCheck className="h-4 w-4" />
        See only mine
      </Button>

      <Button variant="ghost" size="sm" className="gap-1.5">
        <Users className="h-4 w-4" />
        Assign Graders
      </Button>

      <div className="flex-1" />

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={selectedIds.length === 0}
        onClick={onAutogradeSelected}
      >
        <Bot className="h-4 w-4" />
        Autograde Selected
        {selectedIds.length > 0 && (
          <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
            {selectedIds.length}
          </span>
        )}
      </Button>

      <Button
        size="default"
        className="gap-1.5"
        onClick={onAutogradeAll}
      >
        <Bot className="h-4 w-4" />
        Autograde All
      </Button>
    </div>
  );
}
