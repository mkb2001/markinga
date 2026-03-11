"use client";

import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuestionForm } from "./question-form";
import type { Question, QuestionType } from "@/types/database";

const TYPE_LABELS: Record<QuestionType, string> = {
  SHORT_ANSWER: "Short Answer",
  ESSAY: "Essay",
  MULTIPLE_CHOICE: "MCQ",
  STRUCTURED: "Structured",
  PRACTICAL: "Practical",
};

const TYPE_VARIANTS: Record<
  QuestionType,
  "default" | "secondary" | "outline" | "destructive"
> = {
  SHORT_ANSWER: "secondary",
  ESSAY: "default",
  MULTIPLE_CHOICE: "outline",
  STRUCTURED: "secondary",
  PRACTICAL: "outline",
};

interface QuestionListProps {
  examId: string;
  questions: Question[];
  onQuestionsChange: () => void;
}

export function QuestionList({
  examId,
  questions,
  onQuestionsChange,
}: QuestionListProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | undefined>();

  const handleAdd = () => {
    setEditingQuestion(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setDialogOpen(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const response = await fetch(
        `/api/exams/${examId}/questions/${questionId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete question");
      }

      toast.success("Question deleted");
      onQuestionsChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const handleSaved = useCallback(() => {
    onQuestionsChange();
  }, [onQuestionsChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </p>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No questions yet. Add your first question to get started.
          </p>
          <Button variant="outline" size="sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Question Text</TableHead>
                <TableHead className="w-36">Type</TableHead>
                <TableHead className="w-28">Max Marks</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">
                    {question.questionNumber}
                  </TableCell>
                  <TableCell>
                    <p className="line-clamp-2 max-w-md text-sm">
                      {question.questionText}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={TYPE_VARIANTS[question.questionType]}>
                      {TYPE_LABELS[question.questionType]}
                    </Badge>
                  </TableCell>
                  <TableCell>{question.maxMarks}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEdit(question)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <QuestionForm
        examId={examId}
        question={editingQuestion}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={handleSaved}
      />
    </div>
  );
}
