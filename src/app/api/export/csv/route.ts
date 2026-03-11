import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateCsv } from "@/lib/export/csv-generator";
import type { ResultRow } from "@/lib/export/csv-generator";

function calcGrade(percentage: number): string {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");

  if (!examId) {
    return NextResponse.json({ error: "examId is required" }, { status: 400 });
  }

  try {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, userId },
      include: {
        submissions: {
          include: {
            grades: true,
          },
        },
      },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const results: ResultRow[] = exam.submissions.map((submission) => {
      const totalScore = submission.grades.reduce(
        (sum, g) => sum + (g.score ?? 0),
        0
      );
      const maxScore = exam.totalMarks;
      const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const avgConfidence =
        submission.grades.length > 0
          ? submission.grades.reduce((sum, g) => sum + (g.aiConfidence ?? 0), 0) /
            submission.grades.length
          : 0;

      return {
        studentName: submission.studentName ?? "",
        studentNumber: submission.studentNumber ?? "",
        totalScore,
        maxScore,
        percentage,
        grade: calcGrade(percentage),
        confidence: avgConfidence,
        status: submission.status,
      };
    });

    const csv = generateCsv(results);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${exam.title.replace(/[^a-z0-9]/gi, "_")}_results.csv"`,
      },
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV" },
      { status: 500 }
    );
  }
}
