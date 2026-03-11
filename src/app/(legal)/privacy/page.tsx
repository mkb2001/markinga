import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Database, Brain, Lock, Users, Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy - Markinga UG",
  description:
    "Privacy Policy for Markinga UG, the AI-powered exam grading platform for Uganda's education system.",
};

function Section({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card id={id}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-lg text-muted-foreground">
          Last updated: March 2026
        </p>
        <Separator />
      </div>

      {/* Table of Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="grid gap-1.5 text-sm sm:grid-cols-2">
            {[
              { href: "#introduction", label: "1. Introduction" },
              {
                href: "#information-we-collect",
                label: "2. Information We Collect",
              },
              { href: "#how-we-use", label: "3. How We Use Your Information" },
              { href: "#ai-processing", label: "4. Data Processing by AI Models" },
              { href: "#data-storage", label: "5. Data Storage" },
              { href: "#data-sharing", label: "6. Data Sharing" },
              {
                href: "#student-data",
                label: "7. Student Data Protection",
              },
              { href: "#your-rights", label: "8. Your Rights" },
              { href: "#data-security", label: "9. Data Security" },
              { href: "#changes", label: "10. Changes to This Policy" },
              { href: "#contact", label: "11. Contact Information" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* 1. Introduction */}
      <Section id="introduction" icon={Shield} title="1. Introduction">
        <p>
          Welcome to Markinga UG (&quot;we,&quot; &quot;our,&quot; or
          &quot;us&quot;). Markinga UG is an AI-powered exam grading platform
          designed specifically for Uganda&apos;s education system. We are
          operated in the Republic of Uganda and serve educators, schools, and
          institutions across the country.
        </p>
        <p className="mt-3">
          Our platform enables teachers to upload student exam papers and receive
          AI-assisted grading using multiple artificial intelligence models. This
          Privacy Policy explains how we collect, use, store, and protect your
          personal information and the data of students whose papers are
          processed through our system.
        </p>
        <p className="mt-3">
          By using Markinga UG, you agree to the collection and use of
          information in accordance with this policy. If you do not agree with
          this policy, please do not use our services.
        </p>
      </Section>

      {/* 2. Information We Collect */}
      <Section
        id="information-we-collect"
        icon={Database}
        title="2. Information We Collect"
      >
        <h3 className="mb-2 mt-0 text-base font-semibold text-foreground">
          Account Information
        </h3>
        <p>
          We use Clerk as our authentication provider. When you create an
          account, we collect:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>Full name and email address</li>
          <li>Profile information provided through Clerk</li>
          <li>Authentication credentials (managed securely by Clerk)</li>
          <li>School or institution affiliation, if provided</li>
        </ul>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Exam Papers and Student Data
        </h3>
        <p>When you upload exam papers for grading, we process:</p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            Scanned or photographed exam papers (image files or PDFs)
          </li>
          <li>Student names or identifiers as they appear on papers</li>
          <li>Subject and exam details you provide</li>
          <li>Marking schemes and rubrics you upload</li>
        </ul>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          AI Grading Data
        </h3>
        <p>
          During the grading process, we generate and store:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            OCR (Optical Character Recognition) text extracted from exam papers
          </li>
          <li>AI-generated grades and feedback from multiple models</li>
          <li>Averaged scores and final grading results</li>
          <li>Any manual adjustments or overrides made by teachers</li>
        </ul>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Usage Analytics
        </h3>
        <p>We collect standard usage data including:</p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>Pages visited and features used within the platform</li>
          <li>Device type, browser, and operating system</li>
          <li>IP address and approximate location</li>
          <li>Timestamps of activity</li>
        </ul>
      </Section>

      {/* 3. How We Use Your Information */}
      <Section
        id="how-we-use"
        icon={Brain}
        title="3. How We Use Your Information"
      >
        <h3 className="mb-2 mt-0 text-base font-semibold text-foreground">
          Provide Grading Services
        </h3>
        <p>
          Your uploaded exam papers and marking schemes are processed through our
          AI grading pipeline to generate scores, feedback, and assessment
          reports. This is the core purpose of data collection.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Improve AI Accuracy
        </h3>
        <p>
          We analyse aggregated, anonymised grading patterns to improve the
          accuracy and reliability of our AI models over time. This helps ensure
          that grading aligns more closely with Ugandan curriculum standards and
          teacher expectations.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Communicate Updates
        </h3>
        <p>
          We may use your email address to send important service announcements,
          feature updates, and information relevant to your use of Markinga UG.
          You can opt out of non-essential communications at any time.
        </p>
      </Section>

      {/* 4. Data Processing by AI Models */}
      <Section
        id="ai-processing"
        icon={Brain}
        title="4. Data Processing by AI Models"
      >
        <p>
          To provide accurate, reliable grading, Markinga UG sends exam paper
          data to multiple third-party AI services for processing. This is a
          critical part of how our service works, and we want to be fully
          transparent about it.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          AI Providers We Use
        </h3>
        <p>
          Exam paper content (including OCR-extracted text and images) is sent to
          the following AI providers for grading:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            <strong>OpenAI</strong> (GPT models) &mdash; United States-based
            provider
          </li>
          <li>
            <strong>Anthropic</strong> (Claude models) &mdash; United
            States-based provider
          </li>
          <li>
            <strong>Google</strong> (Gemini models) &mdash; United States-based
            provider
          </li>
        </ul>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Why Multiple Models
        </h3>
        <p>
          We use a three-model averaging approach to improve grading reliability.
          Each AI model independently grades the paper, and the results are
          averaged to produce a more balanced and consistent final score. This
          reduces the risk of bias or error from any single model.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Data Handling by AI Providers
        </h3>
        <p>
          Each AI provider processes data according to their own privacy policies
          and data handling practices. We use API-based access, which means data
          sent for grading is typically not used to train these providers&apos;
          models. However, we encourage you to review each provider&apos;s
          policies for full details.
        </p>
      </Section>

      {/* 5. Data Storage */}
      <Section id="data-storage" icon={Database} title="5. Data Storage">
        <h3 className="mb-2 mt-0 text-base font-semibold text-foreground">
          Cloud Storage
        </h3>
        <p>
          Uploaded exam papers and associated files are stored using Supabase
          cloud storage infrastructure. Supabase provides enterprise-grade
          security and reliability for file storage.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Database
        </h3>
        <p>
          User account data, grading results, and platform data are stored in a
          PostgreSQL database managed through Prisma ORM and hosted on Supabase
          infrastructure.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Retention Policies
        </h3>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Account data</strong> is retained for as long as your account
            is active and for a reasonable period thereafter for legal and
            operational purposes.
          </li>
          <li>
            <strong>Exam papers and grading results</strong> are retained for the
            duration of your account. You may request deletion of specific papers
            at any time.
          </li>
          <li>
            <strong>Usage analytics</strong> are retained in aggregated,
            anonymised form and may be kept indefinitely for service improvement.
          </li>
        </ul>
      </Section>

      {/* 6. Data Sharing */}
      <Section id="data-sharing" icon={Users} title="6. Data Sharing">
        <p className="font-medium text-foreground">
          We do not sell your personal data or student data to any third party.
        </p>
        <p className="mt-3">We share data only in the following circumstances:</p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            <strong>AI Grading Providers:</strong> Exam paper content is shared
            with OpenAI, Anthropic, and Google solely for the purpose of
            generating grades and feedback, as described in Section 4.
          </li>
          <li>
            <strong>Authentication Provider:</strong> Account information is
            managed by Clerk for authentication purposes.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose information if
            required by law, regulation, legal process, or governmental request
            under the laws of the Republic of Uganda.
          </li>
          <li>
            <strong>Protection of Rights:</strong> We may share information when
            necessary to protect the rights, property, or safety of Markinga UG,
            our users, or the public.
          </li>
        </ul>
      </Section>

      {/* 7. Student Data Protection */}
      <Section
        id="student-data"
        icon={Shield}
        title="7. Student Data Protection"
      >
        <p>
          We recognise the sensitive nature of student examination data and apply
          heightened protections in line with international best practices for
          student data privacy, including principles similar to the U.S. Family
          Educational Rights and Privacy Act (FERPA).
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Teacher Responsibility
        </h3>
        <p>
          Teachers and school administrators who upload student papers are
          responsible for ensuring they have the appropriate authority or consent
          to process student data through our platform. By uploading student
          papers, you confirm that:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            You are authorised by your school or institution to process student
            examination data.
          </li>
          <li>
            You have obtained any necessary consent from students or their
            guardians as required by applicable local policies.
          </li>
          <li>
            You will use the grading results solely for legitimate educational
            purposes.
          </li>
        </ul>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Our Commitments
        </h3>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            Student data is used exclusively for grading and educational
            purposes.
          </li>
          <li>
            We do not build student profiles or use student data for marketing.
          </li>
          <li>
            Student data is not shared with any party beyond what is necessary
            for the grading service.
          </li>
          <li>
            We support requests for deletion of student data at any time.
          </li>
        </ul>
      </Section>

      {/* 8. Your Rights */}
      <Section id="your-rights" icon={Users} title="8. Your Rights">
        <p>You have the following rights regarding your personal data:</p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Access:</strong> You can request a copy of the personal data
            we hold about you.
          </li>
          <li>
            <strong>Correction:</strong> You can request correction of
            inaccurate or incomplete data.
          </li>
          <li>
            <strong>Deletion:</strong> You can request deletion of your personal
            data and any exam papers you have uploaded.
          </li>
          <li>
            <strong>Data Portability:</strong> You can request an export of your
            grading data in a standard, machine-readable format.
          </li>
          <li>
            <strong>Withdrawal of Consent:</strong> Where processing is based on
            your consent, you may withdraw that consent at any time.
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us using the details
          provided in Section 11.
        </p>
      </Section>

      {/* 9. Data Security */}
      <Section id="data-security" icon={Lock} title="9. Data Security">
        <p>
          We implement appropriate technical and organisational measures to
          protect your data:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            <strong>Encryption in Transit:</strong> All data transmitted between
            your device and our servers is encrypted using TLS/SSL protocols.
          </li>
          <li>
            <strong>Secure Storage:</strong> Data at rest is stored on encrypted
            infrastructure provided by Supabase.
          </li>
          <li>
            <strong>Access Controls:</strong> Access to user data is restricted
            to authorised personnel and systems. Each user can only access their
            own data.
          </li>
          <li>
            <strong>API Security:</strong> Communications with AI providers use
            authenticated, encrypted API connections.
          </li>
          <li>
            <strong>Authentication:</strong> User authentication is handled by
            Clerk, which provides industry-standard security measures including
            multi-factor authentication support.
          </li>
        </ul>
        <p className="mt-3">
          While we strive to protect your data, no method of electronic
          transmission or storage is completely secure. We cannot guarantee
          absolute security but are committed to maintaining the highest
          practical standards.
        </p>
      </Section>

      {/* 10. Changes to This Policy */}
      <Section id="changes" icon={Shield} title="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, or legal requirements. When we make
          material changes:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>We will update the &quot;Last updated&quot; date at the top of this policy.</li>
          <li>
            For significant changes, we will provide notice through the platform
            or via email.
          </li>
          <li>
            Your continued use of Markinga UG after changes are posted
            constitutes acceptance of the updated policy.
          </li>
        </ul>
      </Section>

      {/* 11. Contact Information */}
      <Section id="contact" icon={Mail} title="11. Contact Information">
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or our data practices, please contact us:
        </p>
        <div className="mt-4 rounded-lg bg-muted p-4">
          <p className="font-semibold text-foreground">Markinga UG</p>
          <p className="mt-1">Republic of Uganda</p>
          <p className="mt-1">
            Email:{" "}
            <a
              href="mailto:privacy@markinga.ug"
              className="text-primary hover:underline"
            >
              privacy@markinga.ug
            </a>
          </p>
        </div>
        <p className="mt-4">
          We aim to respond to all privacy-related inquiries within 30 days.
        </p>
      </Section>
    </div>
  );
}
