export interface GradingParams {
  questionText: string;
  questionType: string;
  maxMarks: number;
  modelAnswer?: string;
  markingNotes?: string;
  studentAnswer: string;
  rubricCriteria?: any;
  institutionLevel?: string;
}

export interface GradingResult {
  score: number;
  maxScore: number;
  feedback: string;
  deductions: { reason: string; marks: number }[];
  confidence: number;
}

export interface GradingAdapter {
  grade(params: GradingParams): Promise<GradingResult>;
  name: string;
  model: string;
}

export interface AggregatedResult {
  averageScore: number;
  maxScore: number;
  feedback: string;
  deductions: { reason: string; marks: number }[];
  confidence: number;
  confidenceLevel: 'HIGH' | 'LOW';
  individualResults: { model: string; score: number; feedback: string }[];
}

export interface GradingJobProgress {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  totalQuestions: number;
  gradedQuestions: number;
  modelStatuses: { model: string; status: string }[];
  results?: AggregatedResult[];
}
