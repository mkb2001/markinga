export interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    target: '[data-tour="dashboard"]',
    title: 'Welcome to Markinga UG',
    description:
      'This is your dashboard where you can see all your exams and grading progress.',
    placement: 'bottom',
  },
  {
    id: 'create-exam',
    target: '[data-tour="new-exam"]',
    title: 'Create an Exam',
    description:
      'Start by creating a new exam. Add questions and set up the grading rubric.',
    placement: 'bottom',
  },
  {
    id: 'upload',
    target: '[data-tour="upload"]',
    title: 'Upload Student Papers',
    description:
      'Upload scanned PDFs or photos of student exam papers. Our OCR will extract the text.',
    placement: 'right',
  },
  {
    id: 'autograde',
    target: '[data-tour="autograde"]',
    title: 'Autograde with AI',
    description:
      'Click "Autograde All" to let three AI models grade every submission. Results are averaged for reliability.',
    placement: 'bottom',
  },
  {
    id: 'review',
    target: '[data-tour="review"]',
    title: 'Review Grades',
    description:
      'Review AI-generated grades side-by-side with the original paper. Adjust scores and mark as reviewed.',
    placement: 'left',
  },
  {
    id: 'confidence',
    target: '[data-tour="confidence"]',
    title: 'Confidence Indicators',
    description:
      'Green badges mean all three AI models agreed. Red badges mean there was disagreement - review these carefully.',
    placement: 'bottom',
  },
  {
    id: 'rubric',
    target: '[data-tour="rubric"]',
    title: 'Review the Rubric',
    description:
      "Customize grading rubrics or use pre-built templates for Uganda's curriculum (O-Level, A-Level, UPE, USE).",
    placement: 'right',
  },
];
