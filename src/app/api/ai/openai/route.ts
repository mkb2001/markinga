import { NextRequest, NextResponse } from 'next/server';
import { openaiAdapter } from '@/lib/ai/openai';
import type { GradingParams } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  let params: GradingParams;

  try {
    params = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!params.questionText || !params.questionType || !params.studentAnswer) {
    return NextResponse.json(
      { error: 'questionText, questionType, and studentAnswer are required' },
      { status: 400 }
    );
  }

  if (typeof params.maxMarks !== 'number' || params.maxMarks <= 0) {
    return NextResponse.json(
      { error: 'maxMarks must be a positive number' },
      { status: 400 }
    );
  }

  try {
    const result = await openaiAdapter.grade(params);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'OpenAI grading failed';
    console.error('[/api/ai/openai]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
