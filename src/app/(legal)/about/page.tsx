import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Target,
  Upload,
  Brain,
  ClipboardCheck,
  FileDown,
  Users,
  BookOpen,
  Mail,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About - Markinga UG",
  description:
    "Learn about Markinga UG, the AI-powered exam grading platform built for Uganda's education system.",
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              About Markinga UG
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-Powered Exam Grading for Uganda
            </p>
          </div>
        </div>
        <Separator />
        <p className="text-lg leading-relaxed text-muted-foreground">
          Markinga UG is an AI-powered exam grading platform purpose-built for
          Uganda&apos;s education system. We help teachers save time, improve
          grading consistency, and focus on what matters most: teaching and
          supporting their students.
        </p>
      </div>

      {/* What is Markinga UG */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          What is Markinga UG?
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="leading-relaxed text-muted-foreground">
              Markinga UG is a web-based platform that allows teachers and
              educational institutions to upload student examination papers and
              receive AI-assisted grading. Using a unique three-model approach,
              the platform processes each paper through three independent AI
              systems &mdash; OpenAI (GPT), Anthropic (Claude), and Google
              (Gemini) &mdash; and averages the results to produce more reliable,
              consistent grades.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              The platform handles the entire workflow from paper upload to
              results export, including optical character recognition (OCR) for
              handwritten papers, automated grading against marking schemes,
              detailed feedback generation, and exportable reports. Teachers
              retain full control, reviewing and adjusting all grades before they
              are finalised.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Our Mission */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Target className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
        </div>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-lg font-medium leading-relaxed text-foreground">
              To democratise quality education assessment in Uganda by making
              accurate, consistent, and efficient exam grading accessible to
              every teacher and school across the country.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Uganda&apos;s education system faces significant challenges:
              large class sizes, heavy teacher workloads, and limited resources
              for standardised assessment. A single teacher may be responsible
              for grading hundreds of exam papers, a process that is
              time-consuming, physically demanding, and prone to inconsistency
              due to fatigue.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Markinga UG addresses these challenges by providing teachers with
              an AI-powered assistant that can process papers quickly and
              consistently, freeing up valuable time for instruction, mentorship,
              and student support. We believe that better assessment tools lead
              to better educational outcomes for students across Uganda.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* How It Works */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </div>
                <CardTitle className="text-lg">Upload</CardTitle>
              </div>
              <CardDescription>
                Scan or photograph student exam papers and upload them to the
                platform along with the marking scheme or rubric.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Upload className="h-8 w-8 text-muted-foreground/50" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </div>
                <CardTitle className="text-lg">AI Grades</CardTitle>
              </div>
              <CardDescription>
                Three independent AI models (OpenAI, Anthropic, Google) each
                grade the paper separately. Results are averaged for improved
                accuracy and consistency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Brain className="h-8 w-8 text-muted-foreground/50" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </div>
                <CardTitle className="text-lg">Review</CardTitle>
              </div>
              <CardDescription>
                Teachers review all AI-generated grades, read detailed feedback,
                and make any necessary adjustments. The teacher always has the
                final say.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  4
                </div>
                <CardTitle className="text-lg">Export</CardTitle>
              </div>
              <CardDescription>
                Export finalised grades and reports in standard formats for
                school records, report cards, and institutional reporting
                requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileDown className="h-8 w-8 text-muted-foreground/50" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Built for Ugandan Educators */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Built for Ugandan Educators
          </h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="leading-relaxed text-muted-foreground">
              Markinga UG is not a generic grading tool adapted for Uganda. It
              was designed from the ground up with Ugandan teachers, schools, and
              curriculum standards in mind. We understand the realities of
              education in Uganda &mdash; from the challenges of large class
              sizes in rural primary schools to the rigorous standards of
              national examinations.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Our team works closely with educators across the country to ensure
              the platform meets the practical needs of Ugandan classrooms. We
              are committed to building technology that supports, rather than
              replaces, the vital role that teachers play in Uganda&apos;s
              education system.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Uganda Curriculum Support */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Uganda Curriculum Support
          </h2>
        </div>
        <p className="text-muted-foreground">
          Markinga UG supports grading across all major levels of the Ugandan
          education system:
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              level: "UPE",
              name: "Universal Primary Education",
              description:
                "Primary 1 through Primary 7 assessments and end-of-term examinations",
            },
            {
              level: "USE",
              name: "Universal Secondary Education",
              description:
                "Senior 1 through Senior 4 continuous assessments and mock examinations",
            },
            {
              level: "O-Level",
              name: "Uganda Certificate of Education",
              description:
                "Preparation and mock examinations aligned with UNEB O-Level standards",
            },
            {
              level: "A-Level",
              name: "Uganda Advanced Certificate",
              description:
                "Senior 5 and Senior 6 assessments aligned with UNEB A-Level standards",
            },
            {
              level: "University",
              name: "Higher Education",
              description:
                "University coursework, tests, and examination grading for tertiary institutions",
            },
          ].map((item) => (
            <Card key={item.level}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                    {item.level}
                  </span>
                </div>
                <CardTitle className="text-base">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          The platform is designed to handle a wide range of subjects and paper
          formats common in Ugandan examinations, including essay questions,
          structured questions, multiple choice, and practical assessments.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-7 w-7 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="leading-relaxed text-muted-foreground">
              We welcome feedback, questions, and partnership inquiries from
              teachers, schools, education officials, and anyone interested in
              improving education assessment in Uganda.
            </p>
            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="font-semibold text-foreground">Markinga UG</p>
              <p className="mt-1 text-muted-foreground">Republic of Uganda</p>
              <p className="mt-1 text-muted-foreground">
                General inquiries:{" "}
                <a
                  href="mailto:hello@markinga.ug"
                  className="text-primary hover:underline"
                >
                  hello@markinga.ug
                </a>
              </p>
              <p className="mt-1 text-muted-foreground">
                Support:{" "}
                <a
                  href="mailto:support@markinga.ug"
                  className="text-primary hover:underline"
                >
                  support@markinga.ug
                </a>
              </p>
              <p className="mt-1 text-muted-foreground">
                Partnerships:{" "}
                <a
                  href="mailto:partners@markinga.ug"
                  className="text-primary hover:underline"
                >
                  partners@markinga.ug
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <GraduationCap className="h-12 w-12 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Ready to Transform Your Grading?
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Join Ugandan educators who are saving time and improving grading
            consistency with Markinga UG. Sign up for free during our beta
            period.
          </p>
          <Button asChild size="lg" className="mt-2 gap-2">
            <Link href="/">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
