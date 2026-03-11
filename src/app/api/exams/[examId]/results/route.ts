import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ examId: string }> };

function calcGrade(percentage: number): string {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { examId } = await params;

  try {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, userId },
      include: {
        submissions: {
          include: {
            grades: {
              select: { score: true, maxScore: true, aiConfidence: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const results = exam.submissions.map((submission) => {
      const totalScore = submission.grades.reduce(
        (sum, g) => sum + (g.score ?? 0),
        0
      );
      const maxScore = exam.totalMarks;
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const avgConfidence =
        submission.grades.length > 0
          ? submission.grades.reduce(
              (sum, g) => sum + (g.aiConfidence ?? 0),
              0
            ) / submission.grades.length
          : 0;

      return {
        submissionId: submission.id,
        studentName: submission.studentName,
        studentNumber: submission.studentNumber,
        totalScore,
        maxScore,
        percentage,
        grade: calcGrade(percentage),
        confidence: avgConfidence,
        status: submission.status,
      };
    });

    return NextResponse.json({
      id: exam.id,
      title: exam.title,
      totalMarks: exam.totalMarks,
      results,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}
