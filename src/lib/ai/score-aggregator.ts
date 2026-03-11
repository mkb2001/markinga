import type { AggregatedResult, GradingResult } from './types';

interface ModelResult {
  model: string;
  result: GradingResult;
}

/**
 * Aggregates results from multiple AI models into a single AggregatedResult.
 *
 * Algorithm:
 * 1. Average scores across all models.
 * 2. Compute normalised standard deviation (stdDev) of scores in the 0-1 range.
 * 3. confidence = max(0, 1 - stdDev * 2)  — models that agree closely yield high confidence.
 * 4. confidenceLevel: HIGH if confidence >= 0.7, else LOW.
 * 5. Combine feedback and merge deduction lists.
 */
export function aggregateResults(modelResults: ModelResult[]): AggregatedResult {
  if (modelResults.length === 0) {
    throw new Error('No results to aggregate');
  }

  const maxScore = modelResults[0].result.maxScore;

  // --- Score averaging ---
  const scores = modelResults.map((r) => r.result.score);
  const averageScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

  // --- Confidence via normalised stdDev ---
  const normalisedScores = scores.map((s) => s / (maxScore || 1));
  const mean = normalisedScores.reduce((sum, s) => sum + s, 0) / normalisedScores.length;
  const variance =
    normalisedScores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) /
    normalisedScores.length;
  const stdDev = Math.sqrt(variance);
  const confidence = Math.max(0, 1 - stdDev * 2);
  const confidenceLevel: 'HIGH' | 'LOW' = confidence >= 0.7 ? 'HIGH' : 'LOW';

  // --- Combined feedback ---
  const feedbackParts = modelResults.map(
    (r) => `[${r.model}]: ${r.result.feedback}`
  );
  const feedback = feedbackParts.join('\n\n');

  // --- Merged deductions ---
  // Group by reason and take the average marks for duplicate reasons
  const deductionMap = new Map<string, { totalMarks: number; count: number }>();
  for (const { result } of modelResults) {
    for (const d of result.deductions) {
      const key = d.reason.trim().toLowerCase();
      const existing = deductionMap.get(key);
      if (existing) {
        existing.totalMarks += d.marks;
        existing.count += 1;
      } else {
        deductionMap.set(key, { totalMarks: d.marks, count: 1 });
      }
    }
  }

  // Only include deductions that at least half the models agreed on
  const threshold = Math.ceil(modelResults.length / 2);
  const deductions: { reason: string; marks: number }[] = [];
  for (const [reason, { totalMarks, count }] of deductionMap.entries()) {
    if (count >= threshold) {
      deductions.push({
        reason: reason.charAt(0).toUpperCase() + reason.slice(1),
        marks: Math.round((totalMarks / count) * 10) / 10,
      });
    }
  }

  // --- Individual results summary ---
  const individualResults = modelResults.map((r) => ({
    model: r.model,
    score: r.result.score,
    feedback: r.result.feedback,
  }));

  return {
    averageScore: Math.round(averageScore * 10) / 10,
    maxScore,
    feedback,
    deductions,
    confidence: Math.round(confidence * 100) / 100,
    confidenceLevel,
    individualResults,
  };
}
