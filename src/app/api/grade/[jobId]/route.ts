import { NextRequest, NextResponse } from 'next/server';
import { jobProgressMap } from '../route';
import type { GradingJobProgress } from '@/lib/ai/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  if (!jobId || typeof jobId !== 'string') {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const progress: GradingJobProgress | undefined = jobProgressMap.get(jobId);

  if (!progress) {
    return NextResponse.json(
      { error: `No grading job found with id: ${jobId}` },
      { status: 404 }
    );
  }

  return NextResponse.json(progress);
}
