import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { ExamTable } from "@/components/dashboard/exam-table";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OnboardingWrapper } from "@/components/auth/onboarding-wrapper";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile) {
    redirect("/sign-in");
  }

  const exams = await prisma.exam.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          questions: true,
          submissions: true,
        },
      },
    },
  });

  const totalSubmissions = exams.reduce(
    (sum, exam) => sum + exam._count.submissions,
    0
  );
  const autograded = exams.reduce((sum, exam) => sum + exam.gradedCount, 0);
  const reviewed = exams.reduce(
    (sum, exam) =>
      sum + (exam.status === "COMPLETED" ? exam._count.submissions : 0),
    0
  );

  const stats = {
    totalExams: exams.length,
    totalSubmissions,
    autograded,
    reviewed,
  };

  const needsOnboarding = !profile.onboardingComplete;

  return (
    <>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Manage and autograde your exams"
        >
          <Button asChild>
            <Link href="/exams/new">
              <Plus className="h-4 w-4" />
              New Exam
            </Link>
          </Button>
        </PageHeader>

        <StatsCards stats={stats} />

        <ExamTable exams={exams} />
      </div>

      {needsOnboarding && <OnboardingWrapper />}
    </>
  );
}
