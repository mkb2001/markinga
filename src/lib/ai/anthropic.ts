import Anthropic from '@anthropic-ai/sdk';
import type { GradingAdapter, GradingParams, GradingResult } from './types';
import { buildGradingPrompt } from './prompt-builder';

const ANTHROPIC_MODEL = 'claude-sonnet-4-5';

function parseGradingResponse(
  raw: string,
  maxMarks: number
): Omit<GradingResult, 'maxScore'> {
  let parsed: any;

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Attempt to extract JSON from within the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(`Anthropic returned non-JSON response: ${raw.slice(0, 200)}`);
    }
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new Error(`Anthropic returned unparseable JSON: ${raw.slice(0, 200)}`);
    }
  }

  const score = Math.min(Math.max(Number(parsed.score ?? 0), 0), maxMarks);
  const feedback = String(parsed.feedback ?? '');
  const deductions: { reason: string; marks: number }[] = Array.isArray(parsed.deductions)
    ? parsed.deductions.map((d: any) => ({
        reason: String(d.reason ?? ''),
        marks: Number(d.marks ?? 0),
      }))
    : [];
  const confidence = Math.min(Math.max(Number(parsed.confidence ?? 0.8), 0), 1);

  return { score, feedback, deductions, confidence };
}

export const anthropicAdapter: GradingAdapter = {
  name: 'Anthropic',
  model: ANTHROPIC_MODEL,

  async grade(params: GradingParams): Promise<GradingResult> {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const { systemPrompt, userPrompt } = buildGradingPrompt(params);

    const response = await client.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      temperature: 0.1,
    });

    const contentBlock = response.content[0];
    const raw =
      contentBlock && contentBlock.type === 'text' ? contentBlock.text : '';

    const result = parseGradingResponse(raw, params.maxMarks);

    return {
      ...result,
      maxScore: params.maxMarks,
    };
  },
};
