import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { GradingJobProgress } from '@/lib/ai/types';
import { runGradingJob } from '@/lib/ai/orchestrator';

// Module-level map shared across requests in the same server process.
// Exported so the [jobId] route can import and read it.
export const jobProgressMap = new Map<string, GradingJobProgress>();

export async function POST(request: NextRequest) {
  let body: { examId?: string; submissionIds?: string[] };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { examId, submissionIds } = body;

  if (!examId || typeof examId !== 'string') {
    return NextResponse.json(
      { error: 'examId is required and must be a string' },
      { status: 400 }
    );
  }

  // Resolve which submissions to grade
  let targetSubmissionIds: string[];

  if (submissionIds && Array.isArray(submissionIds) && submissionIds.length > 0) {
    targetSubmissionIds = submissionIds;
  } else {
    // Fetch all READY (OCR completed) submissions for the exam
    const submissions = await prisma.submission.findMany({
      where: {
        examId,
        status: { in: ['READY', 'GRADING'] },
      },
      select: { id: true },
    });

    if (submissions.length === 0) {
      return NextResponse.json(
        { error: 'No ready submissions found for this exam' },
        { status: 404 }
      );
    }

    targetSubmissionIds = submissions.map((s) => s.id);
  }

  // Fetch question IDs for the exam
  const questions = await prisma.question.findMany({
    where: { examId },
    select: { id: true },
    orderBy: { questionNumber: 'asc' },
  });

  if (questions.length === 0) {
    return NextResponse.json(
      { error: 'No questions found for this exam' },
      { status: 404 }
    );
  }

  const questionIds = questions.map((q) => q.id);

  // We process each submission sequentially for now (can be parallelised later).
  // Use the first submission for the job; multi-submission support can be extended.
  const primarySubmissionId = targetSubmissionIds[0];
  const jobId = crypto.randomUUID();

  const initialProgress: GradingJobProgress = {
    jobId,
    status: 'pending',
    progress: 0,
    totalQuestions: questionIds.length,
    gradedQuestions: 0,
    modelStatuses: [
      { model: 'OpenAI', status: 'pending' },
      { model: 'Anthropic', status: 'pending' },
      { model: 'Gemini', status: 'pending' },
    ],
  };

  jobProgressMap.set(jobId, initialProgress);

  // Run grading asynchronously — do NOT await here so we return immediately
  runGradingJob(jobId, primarySubmissionId, questionIds, (progress) => {
    jobProgressMap.set(jobId, progress);
  }).catch((err) => {
    jobProgressMap.set(jobId, {
      ...jobProgressMap.get(jobId)!,
      status: 'failed',
      modelStatuses: [
        { model: 'OpenAI', status: 'failed' },
        { model: 'Anthropic', status: 'failed' },
        { model: 'Gemini', status: 'failed' },
      ],
    });
    console.error(`Grading job ${jobId} failed:`, err);
  });

  return NextResponse.json({ jobId }, { status: 202 });
}
