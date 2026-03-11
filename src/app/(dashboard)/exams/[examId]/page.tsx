import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  BookOpen,
  Upload,
  Users,
  BarChart3,
  Plus,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { ExamStatus, QuestionType } from "@/types/database";

const STATUS_VARIANT: Record<
  ExamStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  DRAFT: "outline",
  ACTIVE: "secondary",
  GRADING: "default",
  COMPLETED: "default",
};

const TYPE_LABELS: Record<QuestionType, string> = {
  SHORT_ANSWER: "Short Answer",
  ESSAY: "Essay",
  MULTIPLE_CHOICE: "MCQ",
  STRUCTURED: "Structured",
  PRACTICAL: "Practical",
};

type PageProps = { params: Promise<{ examId: string }> };

export default async function ExamDetailPage({ params }: PageProps) {
  const { examId } = await params;

  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const exam = await prisma.exam.findFirst({
    where: { id: examId, userId },
    include: {
      questions: { orderBy: { questionNumber: "asc" } },
      submissions: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { grades: { select: { score: true } } },
      },
      _count: {
        select: { questions: true, submissions: true, rubrics: true },
      },
    },
  });

  if (!exam) notFound();

  const gradingProgress =
    exam.submissionCount > 0
      ? Math.round((exam.gradedCount / exam.submissionCount) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/exams">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{exam.title}</h1>
              <Badge variant={STATUS_VARIANT[exam.status]}>{exam.status}</Badge>
            </div>
            <p className="text-muted-foreground">
              {exam.subject} &bull; {exam.level} &bull; {exam.totalMarks} marks
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/exams/${examId}/edit`}>
            <Settings className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{exam._count.questions}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{exam._count.submissions}</p>
              <p className="text-xs text-muted-foreground">Submissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <BarChart3 className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{exam.gradedCount}</p>
              <p className="text-xs text-muted-foreground">Graded</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex h-5 w-5 items-center justify-center">
              <span className="text-sm font-bold text-orange-500">%</span>
            </div>
            <div>
              <p className="text-2xl font-bold">{gradingProgress}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({exam._count.questions})
          </TabsTrigger>
          <TabsTrigger value="submissions">
            Submissions ({exam._count.submissions})
          </TabsTrigger>
          <TabsTrigger value="rubric">
            Rubric ({exam._count.rubrics})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exam Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exam.description && (
                <p className="text-sm text-muted-foreground">{exam.description}</p>
              )}
              <Separator />
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground">Subject</dt>
                  <dd className="font-medium">{exam.subject}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Level</dt>
                  <dd className="font-medium">{exam.level}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Curriculum</dt>
                  <dd className="font-medium">{exam.curriculum}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Total Marks</dt>
                  <dd className="font-medium">{exam.totalMarks}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <Badge variant={STATUS_VARIANT[exam.status]}>
                      {exam.status}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/exams/${examId}/submissions/upload`}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Submissions
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/exams/${examId}/results`}>
                <BarChart3 className="mr-2 h-4 w-4" />
                View Results
              </Link>
            </Button>
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {exam._count.questions} question
              {exam._count.questions !== 1 ? "s" : ""}
            </p>
            <Button size="sm" asChild>
              <Link href={`/exams/${examId}/questions`}>
                <Plus className="mr-2 h-4 w-4" />
                Manage Questions
              </Link>
            </Button>
          </div>

          {exam.questions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No questions added yet
              </p>
            </div>
          ) : (
            <div className="divide-y rounded-lg border">
              {exam.questions.map((q) => (
                <div key={q.id} className="flex items-start gap-3 px-4 py-3">
                  <span className="flex-shrink-0 text-sm font-bold text-muted-foreground">
                    {q.questionNumber}.
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm">{q.questionText}</p>
                    <div className="mt-1 flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {TYPE_LABELS[q.questionType]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {q.maxMarks} marks
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {exam._count.submissions} submission
              {exam._count.submissions !== 1 ? "s" : ""}
            </p>
            <Button size="sm" asChild>
              <Link href={`/exams/${examId}/submissions/upload`}>
                <Upload className="mr-2 h-4 w-4" />
                Upload More
              </Link>
            </Button>
          </div>

          {exam.submissions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No submissions yet
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/exams/${examId}/submissions/upload`}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Submissions
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y rounded-lg border">
              {exam.submissions.map((submission) => {
                const total = submission.grades.reduce(
                  (sum, g) => sum + (g.score ?? 0),
                  0
                );
                return (
                  <Link
                    key={submission.id}
                    href={`/exams/${examId}/submissions/${submission.id}/review`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {submission.studentName || `Submission #${submission.submissionNumber}`}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {submission.originalFilename}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <Badge variant="outline">{submission.status}</Badge>
                      {submission.grades.length > 0 && (
                        <span className="text-sm font-medium">
                          {total}/{exam.totalMarks}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Rubric Tab */}
        <TabsContent value="rubric">
          <Card>
            <CardHeader>
              <CardTitle>Rubric</CardTitle>
              <CardDescription>
                {exam._count.rubrics} rubric criteria defined
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/exams/${examId}/rubric`}>
                  Manage Rubric
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
