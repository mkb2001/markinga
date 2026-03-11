import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  BarChart2,
  GraduationCap,
  FileText,
  HelpCircle,
  CheckCircle2,
  Upload,
  Cpu,
  Eye,
} from "lucide-react";

// ── Grade boundary data ───────────────────────────────────────────────────────

const oLevelBoundaries = [
  { grade: "D1", min: 80, description: "Distinction 1" },
  { grade: "D2", min: 75, description: "Distinction 2" },
  { grade: "C3", min: 65, description: "Credit 3" },
  { grade: "C4", min: 60, description: "Credit 4" },
  { grade: "C5", min: 55, description: "Credit 5" },
  { grade: "C6", min: 50, description: "Credit 6" },
  { grade: "P7", min: 45, description: "Pass 7" },
  { grade: "P8", min: 40, description: "Pass 8" },
  { grade: "F9", min: 0, description: "Fail" },
];

const aLevelBoundaries = [
  { grade: "A", points: 6, min: 80, description: "Distinction" },
  { grade: "B", points: 5, min: 70, description: "Very Good" },
  { grade: "C", points: 4, min: 60, description: "Good" },
  { grade: "D", points: 3, min: 50, description: "Satisfactory" },
  { grade: "E", points: 2, min: 45, description: "Pass" },
  { grade: "O", points: 1, min: 40, description: "Ordinary" },
  { grade: "F", points: 0, min: 0, description: "Fail" },
];

const faqItems = [
  {
    question: "Can I grade handwritten exams?",
    answer:
      "Yes. Upload a scanned photo or PDF of the handwritten paper. Markinga uses Tesseract OCR to extract the text before sending it to the AI models. Accuracy depends on scan quality — clear, well-lit images work best.",
  },
  {
    question: "How are grades calculated when multiple models disagree?",
    answer:
      "Each model's score is recorded individually. The final grade displayed is the average of all active models. Steps where models disagreed are flagged with a red confidence badge so you can review them manually.",
  },
  {
    question: "What file formats are supported for uploads?",
    answer:
      "PDF and common image formats (JPG, PNG, WEBP) are supported. Multi-page PDFs are processed page-by-page. Maximum file size is 20 MB per upload.",
  },
  {
    question: "Are student papers stored on your servers?",
    answer:
      "Files are stored securely in Supabase Storage under your account. No paper content is shared with third parties beyond the AI model providers (OpenAI, Anthropic, Google) during the grading request.",
  },
  {
    question: "Can I export grades to a spreadsheet?",
    answer:
      "Yes. From any exam's results page, click \"Export CSV\" to download all student grades in a spreadsheet-compatible format.",
  },
  {
    question: "How do I create a custom rubric?",
    answer:
      "Go to Exams, open an exam, and navigate to the Rubric tab. You can add criteria, set point values, and write descriptors for each performance level. Templates are available for Uganda curriculum standards.",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Help & Documentation"
        description="Everything you need to get the most out of Markinga UG."
      />

      {/* ── Getting Started ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-muted-foreground" />
            <CardTitle>Getting Started</CardTitle>
          </div>
          <CardDescription>
            Follow these steps to grade your first batch of student papers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-5">
            {[
              {
                icon: FileText,
                step: "1",
                title: "Create an Exam",
                body: "From the Exams page, click \"New Exam\". Enter the exam title, subject, and total marks. Add individual questions with their point allocations and correct answers or model answers.",
              },
              {
                icon: BookOpen,
                step: "2",
                title: "Set Up a Rubric",
                body: "Open the Rubric tab inside your new exam. Choose a curriculum template (O-Level, A-Level, UPE, USE, University) or build a custom rubric by adding criteria and point ranges.",
              },
              {
                icon: Upload,
                step: "3",
                title: "Upload Student Papers",
                body: "Go to the Submissions tab and drag-and-drop scanned PDFs or images. Each file represents one student's paper. Markinga will run OCR automatically to extract the text.",
              },
              {
                icon: Cpu,
                step: "4",
                title: "Autograde with AI",
                body: "Click \"Autograde All\" to send every ungraded submission to your selected AI models. Three models grade each paper independently, then their scores are averaged for reliability.",
              },
              {
                icon: Eye,
                step: "5",
                title: "Review & Adjust",
                body: "Open any submission to see the AI-assigned score alongside the original paper. Check the confidence badge — green means all models agreed, red means review is recommended. Adjust scores if needed, then mark as Reviewed.",
              },
              {
                icon: CheckCircle2,
                step: "6",
                title: "Export Results",
                body: "Once all papers are reviewed, export a CSV from the exam's results page. The file includes student IDs, raw scores, percentages, and final grades mapped to your curriculum's boundaries.",
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <li key={step} className="flex gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* ── Confidence Scores ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart2 className="size-5 text-muted-foreground" />
            <CardTitle>Understanding Confidence Scores</CardTitle>
          </div>
          <CardDescription>
            Confidence indicators tell you how much the three AI models agreed
            on a grade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/15 text-green-700 border-green-200 dark:text-green-400">
                High Confidence
              </Badge>
              <p className="text-sm text-muted-foreground">
                All three models assigned the same or nearly identical scores
                (within 5%). Safe to accept as-is.
              </p>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Badge className="bg-yellow-500/15 text-yellow-700 border-yellow-200 dark:text-yellow-400">
                Medium Confidence
              </Badge>
              <p className="text-sm text-muted-foreground">
                Models varied by 6–15%. The averaged score is likely reasonable
                but a quick manual check is recommended.
              </p>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500/15 text-red-700 border-red-200 dark:text-red-400">
                Low Confidence
              </Badge>
              <p className="text-sm text-muted-foreground">
                Models disagreed by more than 15%. Manual review is strongly
                recommended before marking as final.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Confidence is calculated as{" "}
            <span className="font-mono bg-muted px-1 rounded text-xs">
              1 - (stdDev / maxScore)
            </span>
            , where a lower standard deviation across model scores results in
            higher confidence.
          </p>
        </CardContent>
      </Card>

      {/* ── Grade Boundaries ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GraduationCap className="size-5 text-muted-foreground" />
            <CardTitle>Grade Boundaries</CardTitle>
          </div>
          <CardDescription>
            Uganda National Examinations Board (UNEB) standard grade boundaries
            for O-Level and A-Level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* O-Level */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">
              Uganda Certificate of Education (O-Level / UCE)
            </h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-4 py-2 text-left font-medium">Grade</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Min Score (%)
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {oLevelBoundaries.map((row, i) => (
                    <tr
                      key={row.grade}
                      className={i % 2 === 0 ? "" : "bg-muted/20"}
                    >
                      <td className="px-4 py-2 font-mono font-semibold">
                        {row.grade}
                      </td>
                      <td className="px-4 py-2">{row.min}%</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* A-Level */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">
              Uganda Advanced Certificate of Education (A-Level / UACE)
            </h3>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-4 py-2 text-left font-medium">Grade</th>
                    <th className="px-4 py-2 text-left font-medium">Points</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Min Score (%)
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aLevelBoundaries.map((row, i) => (
                    <tr
                      key={row.grade}
                      className={i % 2 === 0 ? "" : "bg-muted/20"}
                    >
                      <td className="px-4 py-2 font-mono font-semibold">
                        {row.grade}
                      </td>
                      <td className="px-4 py-2">{row.points}</td>
                      <td className="px-4 py-2">{row.min}%</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {row.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Rubric Templates ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-muted-foreground" />
            <CardTitle>Rubric Templates</CardTitle>
          </div>
          <CardDescription>
            Pre-built rubric templates aligned to Uganda&apos;s national
            curriculum standards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                name: "UPE Standard",
                sub: "Uganda Primary Leaving Examinations",
                tags: ["Primary", "P7"],
              },
              {
                name: "USE Standard",
                sub: "Uganda Secondary Education",
                tags: ["S1–S4", "O-Level"],
              },
              {
                name: "UACE Standard",
                sub: "Uganda Advanced Certificate",
                tags: ["S5–S6", "A-Level"],
              },
              {
                name: "University General",
                sub: "Higher education grading scale",
                tags: ["University", "GPA"],
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-lg border p-4 space-y-2 hover:bg-muted/30 transition-colors"
              >
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.sub}</p>
                <div className="flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Templates are applied automatically based on your institution mode.
            You can customise any template from within an individual exam.
          </p>
        </CardContent>
      </Card>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="size-5 text-muted-foreground" />
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {faqItems.map((item, i) => (
              <div key={i}>
                {i > 0 && <Separator className="my-4" />}
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{item.question}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Footer note ──────────────────────────────────────────────── */}
      <p className="text-xs text-center text-muted-foreground pb-4">
        Markinga UG v0.1.0 &mdash; AI-powered exam grading for Uganda&apos;s
        education system.
      </p>
    </div>
  );
}
