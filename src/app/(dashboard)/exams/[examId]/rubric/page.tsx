import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RubricEditor } from "@/components/rubrics/rubric-editor";
import type { CriterionData } from "@/components/rubrics/rubric-criterion";
import type { ScoringConfigValues } from "@/components/rubrics/scoring-config";
import type { RubricLevel } from "@/config/rubric-templates";

interface RubricPageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function RubricPage({ params }: RubricPageProps) {
  const { examId } = await params;

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: {
        orderBy: { questionNumber: "asc" },
        select: {
          id: true,
          questionNumber: true,
          questionText: true,
          maxMarks: true,
        },
      },
      rubrics: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!exam) {
    notFound();
  }

  // Get the most recent rubric for initial data
  const latestRubric = exam.rubrics[0];

  // Parse stored criteria from rubric criteria JSON if present
  let initialCriteria: CriterionData[] | undefined;
  let initialScoring: ScoringConfigValues | undefined;

  if (latestRubric) {
    // criteria is stored as JSON on the rubric model
    const raw = latestRubric.criteria as unknown;
    if (Array.isArray(raw)) {
      initialCriteria = raw.map((item: Record<string, unknown>, i: number) => ({
        id: String(item.id ?? i),
        name: String(item.name ?? ""),
        description: String(item.description ?? ""),
        levels: Array.isArray(item.levels)
          ? (item.levels as RubricLevel[])
          : [],
      }));
    }

    initialScoring = {
      totalPoints: latestRubric.totalPoints ?? 100,
      scoringType: latestRubric.scoringType ?? "POSITIVE",
      allowNegative: latestRubric.allowNegative ?? false,
    };
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold">{exam.title}</h1>
        <p className="text-sm text-muted-foreground">
          {exam.subject} · {exam.level}
          {exam.curriculum ? ` · ${exam.curriculum}` : ""}
        </p>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border">
        <RubricEditor
          examId={examId}
          questions={exam.questions}
          initialCriteria={initialCriteria}
          initialScoring={initialScoring}
          className="h-full"
        />
      </div>
    </div>
  );
}
