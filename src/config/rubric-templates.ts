import type { ScoringType } from "@/types/database";

export interface RubricLevel {
  label: string;
  points: number;
  description: string;
}

export interface RubricCriterionTemplate {
  name: string;
  description: string;
  levels: RubricLevel[];
}

export interface RubricTemplate {
  id: string;
  name: string;
  level: string;
  subject: string;
  criteria: RubricCriterionTemplate[];
  scoringType: ScoringType;
  totalPoints: number;
}

const defaultLevels = (max: number): RubricLevel[] => [
  { label: "Excellent", points: max, description: "Demonstrates thorough understanding and exceptional work." },
  { label: "Good", points: Math.round(max * 0.75), description: "Shows solid understanding with minor errors." },
  { label: "Fair", points: Math.round(max * 0.5), description: "Demonstrates partial understanding with notable gaps." },
  { label: "Poor", points: Math.round(max * 0.25), description: "Shows limited understanding or significant errors." },
  { label: "None", points: 0, description: "No attempt or completely incorrect." },
];

export const rubricTemplates: RubricTemplate[] = [
  // O-Level Math
  {
    id: "o-level-math",
    name: "O-Level Mathematics",
    level: "O-Level",
    subject: "Mathematics",
    scoringType: "POSITIVE",
    totalPoints: 100,
    criteria: [
      {
        name: "Problem Understanding",
        description: "Student demonstrates understanding of the mathematical problem",
        levels: defaultLevels(20),
      },
      {
        name: "Method & Working",
        description: "Correct mathematical method and working shown",
        levels: defaultLevels(30),
      },
      {
        name: "Accuracy of Calculation",
        description: "Numerical accuracy and correctness of final answer",
        levels: defaultLevels(30),
      },
      {
        name: "Presentation & Format",
        description: "Work is clearly presented with appropriate notation",
        levels: defaultLevels(10),
      },
      {
        name: "Units & Conclusion",
        description: "Correct units used and conclusion stated where required",
        levels: defaultLevels(10),
      },
    ],
  },

  // O-Level English
  {
    id: "o-level-english",
    name: "O-Level English Language",
    level: "O-Level",
    subject: "English",
    scoringType: "POSITIVE",
    totalPoints: 100,
    criteria: [
      {
        name: "Content & Ideas",
        description: "Relevance and development of ideas to the task",
        levels: defaultLevels(30),
      },
      {
        name: "Organisation & Structure",
        description: "Logical flow, paragraphing, and overall structure",
        levels: defaultLevels(20),
      },
      {
        name: "Grammar & Syntax",
        description: "Grammatical accuracy and sentence construction",
        levels: defaultLevels(20),
      },
      {
        name: "Vocabulary & Style",
        description: "Range and appropriateness of vocabulary",
        levels: defaultLevels(20),
      },
      {
        name: "Punctuation & Spelling",
        description: "Accurate use of punctuation and spelling",
        levels: defaultLevels(10),
      },
    ],
  },

  // O-Level Science
  {
    id: "o-level-science",
    name: "O-Level Science",
    level: "O-Level",
    subject: "Science",
    scoringType: "POSITIVE",
    totalPoints: 100,
    criteria: [
      {
        name: "Scientific Knowledge",
        description: "Accurate recall and application of scientific concepts",
        levels: defaultLevels(30),
      },
      {
        name: "Experimental Method",
        description: "Understanding of scientific methods and procedures",
        levels: defaultLevels(25),
      },
      {
        name: "Data Analysis",
        description: "Ability to interpret and analyse scientific data",
        levels: defaultLevels(25),
      },
      {
        name: "Conclusions & Evaluation",
        description: "Drawing valid conclusions and evaluating results",
        levels: defaultLevels(20),
      },
    ],
  },

  // O-Level SST
  {
    id: "o-level-sst",
    name: "O-Level Social Studies",
    level: "O-Level",
    subject: "Social Studies",
    scoringType: "POSITIVE",
    totalPoints: 100,
    criteria: [
      {
        name: "Knowledge & Understanding",
        description: "Accurate knowledge of social studies content",
        levels: defaultLevels(30),
      },
      {
        name: "Analysis & Interpretation",
        description: "Ability to analyse sources and historical evidence",
        levels: defaultLevels(25),
      },
      {
        name: "Argumentation",
        description: "Constructing and supporting arguments with evidence",
        levels: defaultLevels(25),
      },
      {
        name: "Communication",
        description: "Clarity and organisation of written response",
        levels: defaultLevels(20),
      },
    ],
  },

  // A-Level Math
  {
    id: "a-level-math",
    name: "A-Level Mathematics",
    level: "A-Level",
    subject: "Mathematics",
    scoringType: "POSITIVE",
    totalPoints: 100,
    criteria: [
      {
        name: "Conceptual Understanding",
        description: "Deep understanding of advanced mathematical concepts",
        levels: defaultLevels(25),
      },
      {
        name: "Method Selection & Application",
        description: "Choosing and applying appropriate mathematical methods",
        levels: defaultLevels(30),
      },
      {
        name: "Accuracy & Precision",
        description: "Correctness of calculations and manipulation of expressions",
        levels: defaultLevels(25),
      },
      {
        name: "Proof & Reasoning",
        description: "Logical reasoning and proof where required",
        levels: defaultLevels(20),
      },
    ],
  },

  // A-Level English
  {
    id: "a-level-english",
    name: "A-Level English Literature",
    level: "A-Level",
    subject: "English",
    scoringType: "POSITIVE",
    totalPoints: 100,
    criteria: [
      {
        name: "Critical Analysis",
        description: "Depth and quality of literary analysis",
        levels: defaultLevels(30),
      },
      {
        name: "Textual Evidence",
        description: "Effective use and integration of quotations and examples",
        levels: defaultLevels(25),
      },
      {
        name: "Argument & Coherence",
        description: "Sustained and coherent line of argument",
        levels: defaultLevels(25),
      },
      {
        name: "Language & Expression",
        description: "Quality and precision of academic writing",
        levels: defaultLevels(20),
      },
    ],
  },

  // UPE Math
  {
    id: "upe-math",
    name: "UPE Mathematics",
    level: "UPE",
    subject: "Mathematics",
    scoringType: "POSITIVE",
    totalPoints: 50,
    criteria: [
      {
        name: "Number & Computation",
        description: "Correct computation and number operations",
        levels: defaultLevels(15),
      },
      {
        name: "Problem Solving",
        description: "Applying mathematics to solve word problems",
        levels: defaultLevels(20),
      },
      {
        name: "Working & Presentation",
        description: "Clear working shown with correct format",
        levels: defaultLevels(15),
      },
    ],
  },

  // UPE English
  {
    id: "upe-english",
    name: "UPE English Language",
    level: "UPE",
    subject: "English",
    scoringType: "POSITIVE",
    totalPoints: 50,
    criteria: [
      {
        name: "Comprehension",
        description: "Understanding of reading passages and questions",
        levels: defaultLevels(20),
      },
      {
        name: "Grammar & Usage",
        description: "Correct grammar, punctuation and sentence structure",
        levels: defaultLevels(15),
      },
      {
        name: "Writing Expression",
        description: "Clarity and appropriateness of written expression",
        levels: defaultLevels(15),
      },
    ],
  },

  // UPE Science
  {
    id: "upe-science",
    name: "UPE Science",
    level: "UPE",
    subject: "Science",
    scoringType: "POSITIVE",
    totalPoints: 50,
    criteria: [
      {
        name: "Scientific Facts",
        description: "Accurate recall of scientific facts and concepts",
        levels: defaultLevels(20),
      },
      {
        name: "Observation & Investigation",
        description: "Making and recording observations",
        levels: defaultLevels(15),
      },
      {
        name: "Application",
        description: "Applying science knowledge to everyday situations",
        levels: defaultLevels(15),
      },
    ],
  },

  // UPE SST
  {
    id: "upe-sst",
    name: "UPE Social Studies",
    level: "UPE",
    subject: "Social Studies",
    scoringType: "POSITIVE",
    totalPoints: 50,
    criteria: [
      {
        name: "Social Knowledge",
        description: "Knowledge of Ugandan history, geography and civics",
        levels: defaultLevels(20),
      },
      {
        name: "Understanding & Interpretation",
        description: "Interpreting social situations and events",
        levels: defaultLevels(15),
      },
      {
        name: "Expression",
        description: "Clarity of written and expressed responses",
        levels: defaultLevels(15),
      },
    ],
  },
];

export const templatesByLevel: Record<string, RubricTemplate[]> = {
  "O-Level": rubricTemplates.filter((t) => t.level === "O-Level"),
  "A-Level": rubricTemplates.filter((t) => t.level === "A-Level"),
  UPE: rubricTemplates.filter((t) => t.level === "UPE"),
};

export function getTemplateById(id: string): RubricTemplate | undefined {
  return rubricTemplates.find((t) => t.id === id);
}
