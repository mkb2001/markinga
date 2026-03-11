export interface GradeBoundary {
  grade: string;
  minPercent: number;
  description?: string;
}

export interface GradeBoundaryConfig {
  level: string;
  boundaries: GradeBoundary[];
}

export const oLevelBoundaries: GradeBoundaryConfig = {
  level: "O-Level",
  boundaries: [
    { grade: "D1", minPercent: 75, description: "Distinction 1" },
    { grade: "D2", minPercent: 65, description: "Distinction 2" },
    { grade: "C3", minPercent: 55, description: "Credit 3" },
    { grade: "C4", minPercent: 50, description: "Credit 4" },
    { grade: "C5", minPercent: 45, description: "Credit 5" },
    { grade: "C6", minPercent: 40, description: "Credit 6" },
    { grade: "P7", minPercent: 35, description: "Pass 7" },
    { grade: "P8", minPercent: 30, description: "Pass 8" },
    { grade: "F9", minPercent: 0, description: "Fail 9" },
  ],
};

export const aLevelBoundaries: GradeBoundaryConfig = {
  level: "A-Level",
  boundaries: [
    { grade: "A", minPercent: 80, description: "Excellent" },
    { grade: "B", minPercent: 70, description: "Very Good" },
    { grade: "C", minPercent: 60, description: "Good" },
    { grade: "D", minPercent: 50, description: "Satisfactory" },
    { grade: "E", minPercent: 40, description: "Adequate" },
    { grade: "O", minPercent: 35, description: "Subsidiary" },
    { grade: "F", minPercent: 0, description: "Fail" },
  ],
};

export const upeBoundaries: GradeBoundaryConfig = {
  level: "UPE",
  boundaries: [
    { grade: "D1", minPercent: 75, description: "Distinction 1" },
    { grade: "D2", minPercent: 65, description: "Distinction 2" },
    { grade: "C3", minPercent: 55, description: "Credit 3" },
    { grade: "C4", minPercent: 50, description: "Credit 4" },
    { grade: "C5", minPercent: 45, description: "Credit 5" },
    { grade: "C6", minPercent: 40, description: "Credit 6" },
    { grade: "P7", minPercent: 35, description: "Pass 7" },
    { grade: "P8", minPercent: 30, description: "Pass 8" },
    { grade: "F9", minPercent: 0, description: "Fail 9" },
  ],
};

export const useBoundaries: GradeBoundaryConfig = {
  level: "USE",
  boundaries: [
    { grade: "D1", minPercent: 75, description: "Distinction 1" },
    { grade: "D2", minPercent: 65, description: "Distinction 2" },
    { grade: "C3", minPercent: 55, description: "Credit 3" },
    { grade: "C4", minPercent: 50, description: "Credit 4" },
    { grade: "C5", minPercent: 45, description: "Credit 5" },
    { grade: "C6", minPercent: 40, description: "Credit 6" },
    { grade: "P7", minPercent: 35, description: "Pass 7" },
    { grade: "P8", minPercent: 30, description: "Pass 8" },
    { grade: "F9", minPercent: 0, description: "Fail 9" },
  ],
};

export const allGradeBoundaries: GradeBoundaryConfig[] = [
  oLevelBoundaries,
  aLevelBoundaries,
  upeBoundaries,
  useBoundaries,
];

export function getGradeForScore(
  score: number,
  maxScore: number,
  config: GradeBoundaryConfig
): GradeBoundary | null {
  if (maxScore === 0) return null;
  const percent = (score / maxScore) * 100;
  const sorted = [...config.boundaries].sort(
    (a, b) => b.minPercent - a.minPercent
  );
  return sorted.find((b) => percent >= b.minPercent) ?? null;
}

export function getBoundariesForLevel(level: string): GradeBoundaryConfig {
  const normalized = level.toLowerCase();
  if (normalized.includes("a-level") || normalized.includes("a level")) {
    return aLevelBoundaries;
  }
  if (normalized.includes("upe")) {
    return upeBoundaries;
  }
  if (normalized.includes("use")) {
    return useBoundaries;
  }
  return oLevelBoundaries;
}
