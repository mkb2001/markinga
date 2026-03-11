import Papa from "papaparse";

export interface ResultRow {
  studentName: string;
  studentNumber: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  confidence: number;
  status: string;
}

export function generateCsv(results: ResultRow[]): string {
  const rows = results.map((r) => ({
    "Student Name": r.studentName || "Unknown",
    "Student Number": r.studentNumber || "N/A",
    "Total Score": r.totalScore,
    "Max Score": r.maxScore,
    "Percentage (%)": r.percentage.toFixed(2),
    Grade: r.grade,
    "AI Confidence (%)": r.confidence.toFixed(2),
    Status: r.status,
  }));

  return Papa.unparse(rows);
}
