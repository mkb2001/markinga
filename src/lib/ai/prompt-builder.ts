import type { GradingParams } from './types';

export interface BuiltPrompt {
  systemPrompt: string;
  userPrompt: string;
}

const PRIMARY_LEVEL_KEYWORDS = ['primary', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'ple'];

function isPrimaryLevel(institutionLevel?: string): boolean {
  if (!institutionLevel) return false;
  const lower = institutionLevel.toLowerCase();
  return PRIMARY_LEVEL_KEYWORDS.some((kw) => lower.includes(kw));
}

export function buildGradingPrompt(params: GradingParams): BuiltPrompt {
  const isPrimary = isPrimaryLevel(params.institutionLevel);

  const languageInstruction = isPrimary
    ? 'Use simple, encouraging language suitable for primary school students. Explain mistakes clearly and gently.'
    : 'Use clear, professional academic language appropriate for secondary or university level. Be precise and thorough in your feedback.';

  const systemPrompt = `You are an expert exam grader for Uganda's education system (${
    params.institutionLevel ?? 'secondary'
  } level). Your task is to evaluate student answers objectively and fairly according to the provided rubric or model answer.

Guidelines:
- Score the student's answer strictly based on the rubric criteria and/or model answer provided.
- Identify specific strengths and weaknesses in the student's response.
- List explicit deductions with the exact marks deducted and the reason for each deduction.
- ${languageInstruction}
- Be consistent and fair. Do not award marks for incorrect or missing content.
- For multiple-choice questions, award full marks only for the correct answer; zero otherwise.
- For essay and structured questions, award partial marks where partial understanding is demonstrated.
- Ensure the final score does not exceed the maximum marks and is not below zero.

You MUST respond with valid JSON only — no markdown, no explanation outside the JSON object. Use this exact schema:
{
  "score": <number between 0 and maxMarks>,
  "feedback": "<constructive feedback string>",
  "deductions": [
    { "reason": "<reason for deduction>", "marks": <positive number deducted> }
  ],
  "confidence": <number between 0 and 1 indicating your confidence in this grade>
}`;

  const rubricSection =
    params.rubricCriteria
      ? `\nRubric Criteria:\n${JSON.stringify(params.rubricCriteria, null, 2)}`
      : '';

  const modelAnswerSection =
    params.modelAnswer
      ? `\nModel Answer:\n${params.modelAnswer}`
      : '';

  const markingNotesSection =
    params.markingNotes
      ? `\nMarking Notes / Examiner Instructions:\n${params.markingNotes}`
      : '';

  const userPrompt = `Question (${params.questionType}):
${params.questionText}

Maximum Marks: ${params.maxMarks}${modelAnswerSection}${markingNotesSection}${rubricSection}

Student's Answer:
${params.studentAnswer}

Grade this answer and return your response as JSON only.`;

  return { systemPrompt, userPrompt };
}
