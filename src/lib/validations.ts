import { z } from "zod";

export const examSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  level: z.string().min(1, "Level is required"),
  totalMarks: z.number().int().positive("Total marks must be a positive number"),
  curriculum: z.string().min(1, "Curriculum is required"),
});

export const questionSchema = z.object({
  questionNumber: z.number().int().positive("Question number must be positive"),
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum([
    "SHORT_ANSWER",
    "ESSAY",
    "MULTIPLE_CHOICE",
    "STRUCTURED",
    "PRACTICAL",
  ]),
  maxMarks: z.number().int().positive("Max marks must be a positive number"),
  modelAnswer: z.string().optional(),
  markingNotes: z.string().optional(),
});

export const rubricSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  criteria: z.string().min(1, "Criteria is required"),
  points: z.number().int().nonnegative("Points must be non-negative"),
  description: z.string().optional(),
});

export const submissionSchema = z.object({
  examId: z.string().min(1, "Exam ID is required"),
  studentName: z.string().optional(),
  studentNumber: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL"),
  fileType: z.enum(["PDF", "IMAGE", "IMAGES"]),
  originalFilename: z.string().min(1, "Filename is required"),
});

export type ExamSchema = z.infer<typeof examSchema>;
export type QuestionSchema = z.infer<typeof questionSchema>;
export type RubricSchema = z.infer<typeof rubricSchema>;
export type SubmissionSchema = z.infer<typeof submissionSchema>;
