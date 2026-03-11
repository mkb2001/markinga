import { prisma } from '@/lib/prisma';
import { AiModel, ConfidenceLevel, SubmissionStatus } from '@/generated/prisma/client';
import type { AggregatedResult, GradingJobProgress, GradingResult } from './types';
import { openaiAdapter } from './openai';
import { anthropicAdapter } from './anthropic';
import { geminiAdapter } from './gemini';
import { aggregateResults } from './score-aggregator';

const adapters = [
  { adapter: openaiAdapter, aiModel: AiModel.OPENAI },
  { adapter: anthropicAdapter, aiModel: AiModel.ANTHROPIC },
  { adapter: geminiAdapter, aiModel: AiModel.GEMINI },
] as const;

/** Called by the grade API route. Runs in the background. */
export async function runGradingJob(
  jobId: string,
  submissionId: string,
  questionIds: string[],
  onProgress: (progress: GradingJobProgress) => void
): Promise<void> {
  const totalQuestions = questionIds.length;
  let gradedQuestions = 0;

  // Fetch submission to get exam-level context
  const submission = await prisma.submission.findUniqueOrThrow({
    where: { id: submissionId },
    include: {
      exam: true,
    },
  });

  // Mark submission as GRADING
  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: SubmissionStatus.GRADING },
  });

  onProgress({
    jobId,
    status: 'processing',
    progress: 0,
    totalQuestions,
    gradedQuestions: 0,
    modelStatuses: adapters.map((a) => ({ model: a.adapter.name, status: 'pending' })),
  });

  const aggregatedResults: AggregatedResult[] = [];

  for (const questionId of questionIds) {
    // Fetch question details
    const question = await prisma.question.findUniqueOrThrow({
      where: { id: questionId },
    });

    const studentAnswer = submission.ocrText ?? '';

    const modelStatuses = adapters.map((a) => ({
      model: a.adapter.name,
      status: 'processing',
    }));

    onProgress({
      jobId,
      status: 'processing',
      progress: Math.round((gradedQuestions / totalQuestions) * 100),
      totalQuestions,
      gradedQuestions,
      modelStatuses,
    });

    // Fan-out to all 3 adapters
    const settledResults = await Promise.allSettled(
      adapters.map(async ({ adapter, aiModel }) => {
        const startTime = Date.now();
        let result: GradingResult;
        let error: string | undefined;

        try {
          result = await adapter.grade({
            questionText: question.questionText,
            questionType: question.questionType,
            maxMarks: question.maxMarks,
            modelAnswer: question.modelAnswer ?? undefined,
            markingNotes: question.markingNotes ?? undefined,
            studentAnswer,
            institutionLevel: submission.exam.level,
          });
        } catch (err) {
          error = err instanceof Error ? err.message : String(err);
          // Write failed AI result to DB
          await prisma.aiGradingResult.upsert({
            where: {
              submissionId_questionId_aiModel: {
                submissionId,
                questionId,
                aiModel,
              },
            },
            create: {
              submissionId,
              questionId,
              aiModel,
              score: 0,
              maxScore: question.maxMarks,
              error,
              latencyMs: Date.now() - startTime,
            },
            update: {
              error,
              latencyMs: Date.now() - startTime,
            },
          });
          throw err;
        }

        const latencyMs = Date.now() - startTime;

        // Write successful AI result to DB
        await prisma.aiGradingResult.upsert({
          where: {
            submissionId_questionId_aiModel: {
              submissionId,
              questionId,
              aiModel,
            },
          },
          create: {
            submissionId,
            questionId,
            aiModel,
            score: result.score,
            maxScore: result.maxScore,
            feedback: result.feedback,
            deductions: result.deductions,
            confidence: result.confidence,
            latencyMs,
          },
          update: {
            score: result.score,
            maxScore: result.maxScore,
            feedback: result.feedback,
            deductions: result.deductions,
            confidence: result.confidence,
            latencyMs,
            error: null,
          },
        });

        return { adapter, result };
      })
    );

    // Collect successful results
    const successfulResults: { model: string; result: GradingResult }[] = [];
    const updatedModelStatuses = adapters.map((a, i) => {
      const settled = settledResults[i];
      if (settled.status === 'fulfilled') {
        successfulResults.push({
          model: a.adapter.name,
          result: settled.value.result,
        });
        return { model: a.adapter.name, status: 'completed' };
      }
      return { model: a.adapter.name, status: 'failed' };
    });

    if (successfulResults.length === 0) {
      // All models failed for this question — skip aggregation
      gradedQuestions += 1;
      onProgress({
        jobId,
        status: 'processing',
        progress: Math.round((gradedQuestions / totalQuestions) * 100),
        totalQuestions,
        gradedQuestions,
        modelStatuses: updatedModelStatuses,
      });
      continue;
    }

    // Aggregate scores
    const aggregated = aggregateResults(successfulResults);
    aggregatedResults.push(aggregated);

    // Write Grade record (upsert in case it already exists)
    await prisma.grade.upsert({
      where: {
        submissionId_questionId: {
          submissionId,
          questionId,
        },
      },
      create: {
        submissionId,
        questionId,
        score: aggregated.averageScore,
        maxScore: aggregated.maxScore,
        feedback: aggregated.feedback,
        deductions: aggregated.deductions,
        aiAveragedScore: aggregated.averageScore,
        aiConfidence: aggregated.confidence,
        confidenceLevel:
          aggregated.confidenceLevel === 'HIGH'
            ? ConfidenceLevel.HIGH
            : ConfidenceLevel.LOW,
      },
      update: {
        score: aggregated.averageScore,
        maxScore: aggregated.maxScore,
        feedback: aggregated.feedback,
        deductions: aggregated.deductions,
        aiAveragedScore: aggregated.averageScore,
        aiConfidence: aggregated.confidence,
        confidenceLevel:
          aggregated.confidenceLevel === 'HIGH'
            ? ConfidenceLevel.HIGH
            : ConfidenceLevel.LOW,
      },
    });

    gradedQuestions += 1;

    onProgress({
      jobId,
      status: 'processing',
      progress: Math.round((gradedQuestions / totalQuestions) * 100),
      totalQuestions,
      gradedQuestions,
      modelStatuses: updatedModelStatuses,
      results: aggregatedResults,
    });
  }

  // Mark submission as GRADED
  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: SubmissionStatus.GRADED },
  });

  onProgress({
    jobId,
    status: 'completed',
    progress: 100,
    totalQuestions,
    gradedQuestions,
    modelStatuses: adapters.map((a) => ({ model: a.adapter.name, status: 'completed' })),
    results: aggregatedResults,
  });
}
