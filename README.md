# Markinga UG

**AI-powered exam grading for Uganda's education system.**

Markinga UG is a web application that enables teachers to upload student exam papers and receive automated grades powered by three independent AI models. Scores are averaged across models and accompanied by confidence indicators, giving educators a reliable, transparent starting point for assessment. The platform is purpose-built for the Ugandan curriculum, supporting UPE, USE, O-Level (UCE), A-Level (UACE), and University-level examinations.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [AI Grading Pipeline](#ai-grading-pipeline)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Multi-model AI grading** -- Each paper is graded independently by OpenAI GPT-4o, Anthropic Claude Sonnet, and Google Gemini Pro. The three scores are averaged to produce a single, more reliable result.
- **Confidence scoring** -- A confidence indicator (HIGH or LOW) is computed from the standard deviation of model scores, so teachers can quickly identify papers that may need manual review.
- **Side-by-side review** -- A split-screen interface pairs the original PDF/image with the grading panel, enabling efficient review and adjustment of AI-generated grades.
- **Uganda curriculum rubric templates** -- Pre-built rubric templates for UPE, O-Level, and A-Level subjects including Mathematics, English, Science, and Social Studies. Teachers can also create custom rubrics.
- **Rubric editor** -- A full rubric builder with criteria, scoring levels, grade boundaries, and support for both positive and negative scoring types.
- **OCR for handwritten papers** -- Tesseract.js extracts text from scanned or photographed handwritten exam papers, making them available for AI grading.
- **Drag-and-drop file upload** -- Upload PDF files or images via a drag-and-drop interface with progress tracking and automatic OCR processing.
- **Dashboard with progress tracking** -- Overview of all exams, submission counts, grading status, and completion rates.
- **CSV and PDF export** -- Export grading results as CSV spreadsheets or formatted PDF reports.
- **Interactive tutorial tour** -- A guided walkthrough that introduces new users to the platform's key features.
- **Institution mode** -- Switch between Primary/Secondary and University modes, which adjusts available curriculum levels, grading scales, and rubric templates.

---

## Tech Stack

| Layer              | Technology                                            |
| ------------------ | ----------------------------------------------------- |
| Framework          | Next.js 16.1.6 (App Router, TypeScript, Turbopack)    |
| Styling            | Tailwind CSS v4, shadcn/ui, Radix UI                  |
| Authentication     | Clerk                                                 |
| Database           | Supabase PostgreSQL via Prisma v7 (driver adapters)   |
| File Storage       | Supabase Storage                                      |
| AI Models          | OpenAI GPT-4o, Anthropic Claude Sonnet, Google Gemini Pro |
| Client State       | Zustand                                               |
| Data Fetching      | TanStack React Query                                  |
| OCR                | Tesseract.js                                          |
| PDF Viewing        | react-pdf                                             |
| Export             | jspdf (PDF), papaparse (CSV)                          |
| Form Handling      | React Hook Form + Zod validation                      |
| Deployment         | Vercel                                                |

---

## Getting Started

### Prerequisites

- **Node.js** 18.17 or later
- **npm** (included with Node.js)
- A **Supabase** project (for PostgreSQL and file storage)
- A **Clerk** application (for authentication)
- API keys for at least one AI provider (all three recommended):
  - OpenAI API key
  - Anthropic API key
  - Google AI API key

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd markinga
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# AI Providers
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/register"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Database Setup

Push the Prisma schema to your Supabase database:

```bash
npm run db:push
```

Or, if you prefer managed migrations:

```bash
npm run db:migrate
```

To browse your data with Prisma Studio:

```bash
npm run db:studio
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
markinga/
├── prisma/
│   └── schema.prisma          # Database schema (PostgreSQL)
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Main application routes
│   │   │   ├── dashboard/     # Overview and progress tracking
│   │   │   ├── exams/         # Exam CRUD, submissions, results, rubrics
│   │   │   ├── help/          # Help and documentation
│   │   │   └── settings/      # User and institution settings
│   │   ├── api/               # API routes
│   │   │   ├── ai/            # AI grading endpoints
│   │   │   ├── auth/          # Auth webhook/callback
│   │   │   ├── exams/         # Exam CRUD API
│   │   │   ├── export/        # CSV/PDF export endpoints
│   │   │   ├── grade/         # Grade management
│   │   │   ├── ocr/           # OCR processing
│   │   │   └── upload/        # File upload handling
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── auth/              # Auth-related components
│   │   ├── dashboard/         # Dashboard widgets
│   │   ├── exams/             # Exam management components
│   │   ├── export/            # Export dialogs and controls
│   │   ├── grading/           # Grading panel and review UI
│   │   ├── layout/            # App shell, sidebar, navigation
│   │   ├── providers/         # Context providers (React Query, theme, etc.)
│   │   ├── rubrics/           # Rubric editor and templates
│   │   ├── shared/            # Reusable shared components
│   │   ├── submissions/       # Upload and submission management
│   │   ├── tour/              # Interactive tutorial components
│   │   └── ui/                # shadcn/ui primitives
│   ├── config/
│   │   ├── grade-boundaries.ts    # Grade boundary definitions
│   │   ├── navigation.ts         # Sidebar navigation config
│   │   ├── rubric-templates.ts   # Uganda curriculum rubric templates
│   │   ├── site.ts               # Site metadata
│   │   └── tour-steps.ts         # Tutorial tour step definitions
│   ├── hooks/
│   │   ├── use-exams.ts          # Exam data fetching hooks
│   │   ├── use-grading.ts        # Grading workflow hooks
│   │   ├── use-institution-mode.ts # Institution type toggle
│   │   ├── use-ocr.ts            # OCR processing hooks
│   │   └── use-tour.ts           # Tutorial tour state
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── anthropic.ts      # Anthropic Claude adapter
│   │   │   ├── gemini.ts         # Google Gemini adapter
│   │   │   ├── openai.ts         # OpenAI GPT adapter
│   │   │   ├── orchestrator.ts   # Multi-model grading orchestrator
│   │   │   ├── prompt-builder.ts # Grading prompt construction
│   │   │   ├── score-aggregator.ts # Score averaging and confidence
│   │   │   └── types.ts          # AI grading type definitions
│   │   ├── export/               # Export utility functions
│   │   ├── ocr/                  # OCR processing utilities
│   │   ├── supabase/             # Supabase client configuration
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── utils.ts              # General utilities
│   │   └── validations.ts        # Zod validation schemas
│   ├── stores/
│   │   └── institution-store.ts  # Zustand store for institution mode
│   ├── types/
│   │   └── database.ts           # Shared type definitions
│   └── middleware.ts             # Clerk auth middleware
├── components.json               # shadcn/ui configuration
├── next.config.ts
├── prisma.config.ts
├── vercel.json
├── package.json
└── tsconfig.json
```

---

## AI Grading Pipeline

The grading pipeline is the core of Markinga UG. It is implemented in `src/lib/ai/` and works as follows:

### 1. Submission and OCR

When a teacher uploads a student paper (PDF or image), the file is stored in Supabase Storage. If the paper contains handwritten content, Tesseract.js performs OCR to extract the text. The submission status progresses through: `UPLOADED` -> `OCR_PROCESSING` -> `READY`.

### 2. Fan-out to Three AI Models

The orchestrator (`orchestrator.ts`) sends each question to all three AI adapters concurrently using `Promise.allSettled`:

- **OpenAI GPT-4o** (`openai.ts`)
- **Anthropic Claude Sonnet** (`anthropic.ts`)
- **Google Gemini Pro** (`gemini.ts`)

Each adapter receives the question text, question type, maximum marks, model answer, marking notes, the student's extracted answer, and the institution level. Each adapter returns a score, feedback, deductions, and a per-model confidence value. Individual results are persisted to the `ai_grading_results` table so that per-model breakdowns are always available.

### 3. Score Aggregation and Confidence

The score aggregator (`score-aggregator.ts`) combines the results:

1. **Average scores** across all successful models.
2. **Compute normalised standard deviation** of scores mapped to the 0--1 range.
3. **Derive confidence**: `confidence = max(0, 1 - stdDev * 2)`. Models that agree closely yield high confidence.
4. **Assign confidence level**: HIGH if confidence >= 0.7, otherwise LOW.
5. **Merge feedback** from all models into a combined summary.
6. **Consolidate deductions** -- only deductions that at least half the models agree on are included, with marks averaged.

### 4. Grade Record

The aggregated score, feedback, deductions, and confidence level are written to the `grades` table. Teachers can then review grades in the side-by-side interface, adjust scores manually (flagged as `humanAdjusted`), and mark submissions as reviewed.

### 5. Fault Tolerance

If one or two models fail, grading continues with the remaining successful models. If all three models fail for a given question, that question is skipped and the failure is recorded. Per-model latency and error information is stored for diagnostics.

---

## Deployment

Markinga UG is configured for deployment on [Vercel](https://vercel.com).

### Steps

1. Push your repository to GitHub.

2. Import the project in the Vercel dashboard.

3. Add all environment variables from the [Environment Variables](#environment-variables) section to your Vercel project settings.

4. The build command is pre-configured in `package.json`:

   ```
   npx prisma generate && next build
   ```

5. Deploy. Vercel will automatically build and serve the application.

### Notes

- Prisma Client is generated at build time via the `vercel-build` script.
- The `postinstall` script also runs `prisma generate` to ensure the client is available after `npm install`.
- Ensure your Supabase database is accessible from Vercel's network. If using connection pooling, set `DATABASE_URL` to the pooled connection string and `DIRECT_URL` to the direct connection string.

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and ensure the application builds without errors: `npm run build`.
4. Run the linter: `npm run lint`.
5. Commit your changes with a clear, descriptive message.
6. Open a pull request against the `main` branch.

Please keep pull requests focused on a single concern and include a description of what changes were made and why.

---

## License

This project is licensed under the [MIT License](LICENSE).
