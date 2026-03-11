"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questionSchema, type QuestionSchema } from "@/lib/validations";
import type { Question } from "@/types/database";

const QUESTION_TYPES = [
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "ESSAY", label: "Essay" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "STRUCTURED", label: "Structured" },
  { value: "PRACTICAL", label: "Practical" },
] as const;

interface QuestionFormProps {
  examId: string;
  question?: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function QuestionForm({
  examId,
  question,
  open,
  onOpenChange,
  onSaved,
}: QuestionFormProps) {
  const isEdit = !!question;

  const form = useForm<QuestionSchema>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionNumber: question?.questionNumber ?? 1,
      questionText: question?.questionText ?? "",
      questionType: question?.questionType ?? "SHORT_ANSWER",
      maxMarks: question?.maxMarks ?? 10,
      modelAnswer: question?.modelAnswer ?? "",
      markingNotes: question?.markingNotes ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        questionNumber: question?.questionNumber ?? 1,
        questionText: question?.questionText ?? "",
        questionType: question?.questionType ?? "SHORT_ANSWER",
        maxMarks: question?.maxMarks ?? 10,
        modelAnswer: question?.modelAnswer ?? "",
        markingNotes: question?.markingNotes ?? "",
      });
    }
  }, [open, question, form]);

  const onSubmit = async (values: QuestionSchema) => {
    try {
      const url = isEdit
        ? `/api/exams/${examId}/questions/${question.id}`
        : `/api/exams/${examId}/questions`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save question");
      }

      toast.success(isEdit ? "Question updated" : "Question added");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Question" : "Add Question"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="questionNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Number</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Marks</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {QUESTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the question text..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Answer (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Expected answer..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="markingNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marking Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes for markers..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Saving..."
                  : isEdit
                  ? "Update Question"
                  : "Add Question"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
