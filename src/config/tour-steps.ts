export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  route?: string; // route pattern — use {examId} and {submissionId} as placeholders
}

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="dashboard"]',
    title: 'Welcome to Markinga UG',
    description:
      'This is your dashboard. We\'ve created a sample exam so you can see how everything works.',
    placement: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'create-exam',
    target: '[data-tour="new-exam"]',
    title: 'Create an Exam',
    description:
      'Start by creating a new exam. Add questions, set the subject and level, then define the grading rubric.',
    placement: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'exam-overview',
    target: '[data-tour="exam-overview"]',
    title: 'Exam Overview',
    description:
      'Here you can see your exam stats — questions, submissions, and grading progress at a glance.',
    placement: 'bottom',
    route: '/exams/{examId}',
  },
  {
    id: 'upload',
    target: '[data-tour="upload"]',
    title: 'Upload Student Papers',
    description:
      'Upload scanned PDFs or photos of student exam papers. Our OCR will extract the text automatically.',
    placement: 'right',
    route: '/exams/{examId}',
  },
  {
    id: 'review',
    target: '[data-tour="review"]',
    title: 'Review AI Grades',
    description:
      'Review AI-generated grades side-by-side with the original paper. You can adjust scores and add feedback.',
    placement: 'left',
    route: '/exams/{examId}/submissions/{submissionId}',
  },
  {
    id: 'confidence',
    target: '[data-tour="confidence"]',
    title: 'Confidence Indicators',
    description:
      'HIGH means all three AI models agreed on the score. LOW means there was disagreement — review these carefully.',
    placement: 'bottom',
    route: '/exams/{examId}/submissions/{submissionId}',
  },
  {
    id: 'rubric',
    target: '[data-tour="rubric"]',
    title: 'Rubric & Templates',
    description:
      "Customize grading rubrics or use pre-built templates for Uganda's curriculum (O-Level, A-Level, UPE, USE).",
    placement: 'right',
    route: '/exams/{examId}',
  },
];

/** Resolve route placeholders with actual IDs */
export function resolveRoute(
  route: string,
  examId: string | null,
  submissionId: string | null
): string {
  let resolved = route;
  if (examId) resolved = resolved.replace('{examId}', examId);
  if (submissionId) resolved = resolved.replace('{submissionId}', submissionId);
  return resolved;
}
