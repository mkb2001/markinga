import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, BookOpen, Users, CheckCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import type { ExamStatus } from "@/types/database";

const STATUS_VARIANT: Record<
  ExamStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  DRAFT: "outline",
  ACTIVE: "secondary",
  GRADING: "default",
  COMPLETED: "default",
};

const STATUS_LABEL: Record<ExamStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  GRADING: "Grading",
  COMPLETED: "Completed",
};

export default async function ExamsPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const exams = await prisma.exam.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { questions: true, submissions: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
          <p className="text-muted-foreground">
            Manage your exams and mark student submissions
          </p>
        </div>
        <Button asChild>
          <Link href="/exams/new">
            <Plus className="mr-2 h-4 w-4" />
            New Exam
          </Link>
        </Button>
      </div>

      {exams.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium">No exams yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first exam to start marking submissions
            </p>
          </div>
          <Button asChild>
            <Link href="/exams/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const progress =
              exam.submissionCount > 0
                ? Math.round((exam.gradedCount / exam.submissionCount) * 100)
                : 0;

            return (
              <Link key={exam.id} href={`/exams/${exam.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-2 text-base">
                        {exam.title}
                      </CardTitle>
                      <Badge
                        variant={STATUS_VARIANT[exam.status]}
                        className="flex-shrink-0"
                      >
                        {STATUS_LABEL[exam.status]}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-1">
                      {exam.subject} &bull; {exam.level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" />
                        {exam._count.questions} question
                        {exam._count.questions !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {exam._count.submissions} submission
                        {exam._count.submissions !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {exam.submissionCount > 0 && (
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Grading progress
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <p className="mt-3 text-xs text-muted-foreground">
                      {exam.totalMarks} total marks &bull; {exam.curriculum}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
