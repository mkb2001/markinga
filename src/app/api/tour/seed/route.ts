import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getTemplateById } from "@/config/rubric-templates";

const SAMPLE_EXAM_TITLE = "[Sample] O-Level Mathematics";

const QUESTIONS = [
  {
    questionNumber: 1,
    questionText: "Solve for x: 2x + 5 = 13",
    questionType: "SHORT_ANSWER" as const,
    maxMarks: 10,
    modelAnswer: "2x + 5 = 13\n2x = 13 - 5\n2x = 8\nx = 4",
    markingNotes:
      "Award 3 marks for correct rearrangement, 3 marks for simplification, 4 marks for correct final answer.",
  },
  {
    questionNumber: 2,
    questionText:
      "A rectangle has length 12cm and width 8cm. Calculate the area and perimeter.",
    questionType: "STRUCTURED" as const,
    maxMarks: 10,
    modelAnswer:
      "Area = length × width = 12 × 8 = 96 cm²\nPerimeter = 2(length + width) = 2(12 + 8) = 2(20) = 40 cm",
    markingNotes:
      "Award 5 marks for correct area with units. Award 5 marks for correct perimeter with units. Deduct 1 mark for missing units.",
  },
  {
    questionNumber: 3,
    questionText: "Simplify: 3(2x - 4) + 5x",
    questionType: "SHORT_ANSWER" as const,
    maxMarks: 10,
    modelAnswer: "3(2x - 4) + 5x\n= 6x - 12 + 5x\n= 11x - 12",
    markingNotes:
      "Award 4 marks for correct expansion, 3 marks for collecting like terms, 3 marks for correct final answer.",
  },
];

const STUDENT_OCR_TEXT = `Question 1:
2x + 5 = 13
2x = 13 - 5
2x = 8
x = 4

Question 2:
Area = length x width
Area = 12 x 8 = 96 cm2

Perimeter = 2(l + w)
Perimeter = 2(12 + 8)
Perimeter = 2 x 20 = 40cm

Question 3:
3(2x - 4) + 5x
= 6x - 12 + 5x
= 11x - 12`;

// AI grading results per question: [OPENAI, ANTHROPIC, GEMINI]
// Q1 & Q3: models mostly agree (HIGH confidence)
// Q2: models disagree (LOW confidence) to demo confidence indicators
const AI_RESULTS: {
  questionIndex: number;
  model: "OPENAI" | "ANTHROPIC" | "GEMINI";
  score: number;
  feedback: string;
  deductions: { reason: string; marks: number }[];
  confidence: number;
}[] = [
  // Q1 — HIGH confidence (all agree ~9-10)
  {
    questionIndex: 0,
    model: "OPENAI",
    score: 10,
    feedback:
      "Excellent work. The student correctly rearranged the equation, simplified step by step, and arrived at the correct answer x = 4.",
    deductions: [],
    confidence: 0.97,
  },
  {
    questionIndex: 0,
    model: "ANTHROPIC",
    score: 10,
    feedback:
      "The student demonstrated clear understanding of linear equations. All working is shown correctly and the final answer is accurate.",
    deductions: [],
    confidence: 0.95,
  },
  {
    questionIndex: 0,
    model: "GEMINI",
    score: 9,
    feedback:
      "Correct method and final answer. Minor presentation issue — could label the final answer more clearly.",
    deductions: [
      { reason: "Presentation: final answer not clearly labelled", marks: 1 },
    ],
    confidence: 0.91,
  },
  // Q2 — LOW confidence (models disagree: 7, 9, 5)
  {
    questionIndex: 1,
    model: "OPENAI",
    score: 7,
    feedback:
      "Area calculation is correct (96 cm²). Perimeter is correct (40 cm) but units are inconsistent — 'cm2' used instead of 'cm²' for area.",
    deductions: [
      { reason: "Inconsistent unit notation for area", marks: 1 },
      { reason: "Missing superscript in cm² notation", marks: 2 },
    ],
    confidence: 0.65,
  },
  {
    questionIndex: 1,
    model: "ANTHROPIC",
    score: 9,
    feedback:
      "Both area and perimeter are calculated correctly with working shown. The student used the correct formulas. Minor unit formatting issue.",
    deductions: [
      { reason: "Unit formatting: wrote cm2 instead of cm²", marks: 1 },
    ],
    confidence: 0.82,
  },
  {
    questionIndex: 1,
    model: "GEMINI",
    score: 5,
    feedback:
      "Area is correct. Perimeter formula is correct but the student should have shown the units more clearly throughout. Working could be more detailed.",
    deductions: [
      { reason: "Insufficient working shown for perimeter", marks: 3 },
      { reason: "Unit notation issues", marks: 2 },
    ],
    confidence: 0.55,
  },
  // Q3 — HIGH confidence (all agree ~9-10)
  {
    questionIndex: 2,
    model: "OPENAI",
    score: 10,
    feedback:
      "Perfect simplification. The student correctly expanded the brackets and collected like terms to get 11x - 12.",
    deductions: [],
    confidence: 0.98,
  },
  {
    questionIndex: 2,
    model: "ANTHROPIC",
    score: 10,
    feedback:
      "Excellent algebraic manipulation. Each step is clearly shown: expansion, then combining like terms. Final answer 11x - 12 is correct.",
    deductions: [],
    confidence: 0.96,
  },
  {
    questionIndex: 2,
    model: "GEMINI",
    score: 9,
    feedback:
      "Correct expansion and simplification. The final answer 11x - 12 is accurate. Could benefit from stating 'like terms' explicitly.",
    deductions: [
      {
        reason: "Did not explicitly identify like terms being combined",
        marks: 1,
      },
    ],
    confidence: 0.93,
  },
];

// Aggregated grades per question
const GRADES = [
  {
    questionIndex: 0,
    score: 9.7,
    aiAveragedScore: 9.7,
    aiConfidence: 0.94,
    confidenceLevel: "HIGH" as const,
    feedback:
      "[OpenAI]: Excellent work. The student correctly rearranged the equation, simplified step by step, and arrived at the correct answer x = 4.\n\n[Anthropic]: The student demonstrated clear understanding of linear equations. All working is shown correctly and the final answer is accurate.\n\n[Gemini]: Correct method and final answer. Minor presentation issue — could label the final answer more clearly.",
    deductions: [] as { reason: string; marks: number }[],
  },
  {
    questionIndex: 1,
    score: 7.0,
    aiAveragedScore: 7.0,
    aiConfidence: 0.42,
    confidenceLevel: "LOW" as const,
    feedback:
      "[OpenAI]: Area calculation is correct (96 cm²). Perimeter is correct (40 cm) but units are inconsistent.\n\n[Anthropic]: Both area and perimeter are calculated correctly with working shown. Minor unit formatting issue.\n\n[Gemini]: Area is correct. Perimeter formula is correct but working could be more detailed.",
    deductions: [
      { reason: "Unit notation issues", marks: 1.5 },
      { reason: "Insufficient detail in working", marks: 1.5 },
    ],
  },
  {
    questionIndex: 2,
    score: 9.7,
    aiAveragedScore: 9.7,
    aiConfidence: 0.96,
    confidenceLevel: "HIGH" as const,
    feedback:
      "[OpenAI]: Perfect simplification. The student correctly expanded the brackets and collected like terms.\n\n[Anthropic]: Excellent algebraic manipulation. Each step is clearly shown.\n\n[Gemini]: Correct expansion and simplification. The final answer 11x - 12 is accurate.",
    deductions: [] as { reason: string; marks: number }[],
  },
];

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if sample exam already exists for this user
  const existing = await prisma.exam.findFirst({
    where: { userId, title: SAMPLE_EXAM_TITLE },
    include: {
      submissions: { take: 1, select: { id: true } },
    },
  });

  if (existing) {
    return NextResponse.json({
      examId: existing.id,
      submissionId: existing.submissions[0]?.id ?? null,
      alreadyExists: true,
    });
  }

  // Create exam
  const exam = await prisma.exam.create({
    data: {
      title: SAMPLE_EXAM_TITLE,
      description:
        "A sample O-Level Mathematics exam created by the guided tour. Feel free to explore or delete it.",
      subject: "Mathematics",
      level: "O-Level",
      curriculum: "Uganda",
      totalMarks: 30,
      status: "COMPLETED",
      submissionCount: 1,
      gradedCount: 1,
      userId,
    },
  });

  // Create questions
  const questions = await Promise.all(
    QUESTIONS.map((q) =>
      prisma.question.create({
        data: { ...q, examId: exam.id },
      })
    )
  );

  // Create rubric from template
  const template = getTemplateById("o-level-math");
  if (template) {
    await prisma.rubric.create({
      data: {
        name: template.name,
        description: "Auto-generated rubric from O-Level Mathematics template",
        level: template.level,
        subject: template.subject,
        scoringType: template.scoringType,
        totalPoints: template.totalPoints,
        criteria: template.criteria as never,
        userId,
        examId: exam.id,
      },
    });
  }

  // Create submission
  const submission = await prisma.submission.create({
    data: {
      examId: exam.id,
      studentName: "John Mukasa",
      studentNumber: "2024/001",
      fileUrl: "",
      fileType: "PDF",
      originalFilename: "john_mukasa_math_olevel.pdf",
      submissionNumber: 1,
      ocrStatus: "COMPLETED",
      ocrConfidence: 0.94,
      ocrText: STUDENT_OCR_TEXT,
      status: "GRADED",
    },
  });

  // Create AI grading results (9 total: 3 models × 3 questions)
  await Promise.all(
    AI_RESULTS.map((r) =>
      prisma.aiGradingResult.create({
        data: {
          submissionId: submission.id,
          questionId: questions[r.questionIndex].id,
          aiModel: r.model,
          score: r.score,
          maxScore: QUESTIONS[r.questionIndex].maxMarks,
          feedback: r.feedback,
          deductions: r.deductions as never,
          confidence: r.confidence,
          latencyMs: Math.floor(Math.random() * 2000) + 800,
        },
      })
    )
  );

  // Create aggregated grades (3 total: 1 per question)
  await Promise.all(
    GRADES.map((g) =>
      prisma.grade.create({
        data: {
          submissionId: submission.id,
          questionId: questions[g.questionIndex].id,
          score: g.score,
          maxScore: QUESTIONS[g.questionIndex].maxMarks,
          feedback: g.feedback,
          deductions: g.deductions as never,
          aiAveragedScore: g.aiAveragedScore,
          aiConfidence: g.aiConfidence,
          confidenceLevel: g.confidenceLevel,
          humanAdjusted: false,
          isReviewed: false,
        },
      })
    )
  );

  return NextResponse.json({
    examId: exam.id,
    submissionId: submission.id,
    alreadyExists: false,
  });
}
