import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GradingAdapter, GradingParams, GradingResult } from './types';
import { buildGradingPrompt } from './prompt-builder';

const GEMINI_MODEL = 'gemini-2.0-flash';

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
      throw new Error(`Gemini returned non-JSON response: ${raw.slice(0, 200)}`);
    }
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new Error(`Gemini returned unparseable JSON: ${raw.slice(0, 200)}`);
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

export const geminiAdapter: GradingAdapter = {
  name: 'Gemini',
  model: GEMINI_MODEL,

  async grade(params: GradingParams): Promise<GradingResult> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

    const { systemPrompt, userPrompt } = buildGradingPrompt(params);

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent(userPrompt);
    const raw = result.response.text();

    const parsed = parseGradingResponse(raw, params.maxMarks);

    return {
      ...parsed,
      maxScore: params.maxMarks,
    };
  },
};
