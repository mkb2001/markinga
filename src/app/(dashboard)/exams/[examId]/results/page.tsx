import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExportDialogTrigger } from "@/components/export/export-dialog-trigger";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ examId: string }> };

function calcGrade(percentage: number): string {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A":
      return "text-green-600";
    case "B":
      return "text-blue-600";
    case "C":
      return "text-yellow-600";
    case "D":
      return "text-orange-600";
    default:
      return "text-red-600";
  }
}

export default async function ResultsPage({ params }: PageProps) {
  const { examId } = await params;

  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

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

  if (!exam) notFound();

  const results = exam.submissions.map((submission) => {
    const totalScore = submission.grades.reduce(
      (sum, g) => sum + (g.score ?? 0),
      0
    );
    const percentage =
      exam.totalMarks > 0 ? (totalScore / exam.totalMarks) * 100 : 0;
    const avgConfidence =
      submission.grades.length > 0
        ? submission.grades.reduce((sum, g) => sum + (g.aiConfidence ?? 0), 0) /
          submission.grades.length
        : 0;
    const grade = calcGrade(percentage);

    return {
      submissionId: submission.id,
      studentName: submission.studentName,
      studentNumber: submission.studentNumber,
      totalScore,
      maxScore: exam.totalMarks,
      percentage,
      grade,
      confidence: avgConfidence,
      status: submission.status,
    };
  });

  const avgPercentage =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/exams/${examId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Results</h1>
            <p className="text-muted-foreground">{exam.title}</p>
          </div>
        </div>
        <ExportDialogTrigger examId={examId} examTitle={exam.title} />
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{results.length}</p>
            <p className="text-xs text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{avgPercentage.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Class Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{exam.totalMarks}</p>
            <p className="text-xs text-muted-foreground">Total Marks</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <CardDescription>
            {results.length} graded submission
            {results.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No graded submissions yet.
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Student No.</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row) => (
                    <TableRow key={row.submissionId}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/exams/${examId}/submissions/${row.submissionId}/review`}
                          className="hover:underline"
                        >
                          {row.studentName || "Unknown"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.studentNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        {row.totalScore}/{row.maxScore}
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({row.percentage.toFixed(1)}%)
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-lg font-bold",
                            gradeColor(row.grade)
                          )}
                        >
                          {row.grade}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.confidence >= 80
                              ? "default"
                              : row.confidence >= 60
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {row.confidence.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {row.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
