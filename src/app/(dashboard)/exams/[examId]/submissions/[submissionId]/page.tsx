import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReviewScreen } from "@/components/grading/review-screen";

interface ReviewPageProps {
  params: Promise<{
    examId: string;
    submissionId: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { examId, submissionId } = await params;

  // Fetch submission with grades, questions, and AI results
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      grades: {
        include: {
          question: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      aiGradingResults: true,
    },
  });

  if (!submission || submission.examId !== examId) {
    notFound();
  }

  // Get all submission IDs for this exam (for navigation)
  const allSubmissions = await prisma.submission.findMany({
    where: { examId },
    orderBy: { submissionNumber: "asc" },
    select: { id: true },
  });

  const submissionIds = allSubmissions.map((s) => s.id);

  // Use the first grade for the primary display
  const primaryGrade = submission.grades[0];

  if (!primaryGrade) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">No grades available yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This submission has not been graded yet.
          </p>
        </div>
      </div>
    );
  }

  // Filter AI results to those matching the primary grade's question
  const relevantAiResults = submission.aiGradingResults.filter(
    (r) => r.questionId === primaryGrade.questionId
  );

  return (
    <div className="h-[calc(100vh-8rem)]">
      <ReviewScreen
        submission={{
          id: submission.id,
          examId: submission.examId,
          studentName: submission.studentName,
          studentNumber: submission.studentNumber,
          submissionNumber: submission.submissionNumber,
          fileUrl: submission.fileUrl,
          fileType: submission.fileType,
        }}
        grade={{
          id: primaryGrade.id,
          score: primaryGrade.score,
          maxScore: primaryGrade.maxScore,
          feedback: primaryGrade.feedback,
          deductions: primaryGrade.deductions,
          aiAveragedScore: primaryGrade.aiAveragedScore,
          aiConfidence: primaryGrade.aiConfidence,
          confidenceLevel: primaryGrade.confidenceLevel,
          humanAdjusted: primaryGrade.humanAdjusted,
          isReviewed: primaryGrade.isReviewed,
        }}
        question={{
          id: primaryGrade.question.id,
          questionNumber: primaryGrade.question.questionNumber,
          questionText: primaryGrade.question.questionText,
          questionType: primaryGrade.question.questionType,
          maxMarks: primaryGrade.question.maxMarks,
        }}
        aiResults={relevantAiResults.map((r) => ({
          id: r.id,
          aiModel: r.aiModel,
          score: r.score,
          maxScore: r.maxScore,
          confidence: r.confidence,
        }))}
        submissionIds={submissionIds}
        totalSubmissions={allSubmissions.length}
      />
    </div>
  );
}
