import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  UserCheck,
  ShieldCheck,
  Brain,
  Scale,
  AlertTriangle,
  CreditCard,
  Gavel,
  Mail,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Service - Markinga UG",
  description:
    "Terms of Service for Markinga UG, the AI-powered exam grading platform for Uganda's education system.",
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

export default function TermsOfServicePage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Terms of Service
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
              { href: "#acceptance", label: "1. Acceptance of Terms" },
              { href: "#description", label: "2. Description of Service" },
              { href: "#registration", label: "3. Account Registration" },
              { href: "#acceptable-use", label: "4. Acceptable Use" },
              {
                href: "#intellectual-property",
                label: "5. Intellectual Property",
              },
              { href: "#ai-disclaimer", label: "6. AI Grading Disclaimer" },
              { href: "#accuracy", label: "7. Accuracy and Limitations" },
              { href: "#payment", label: "8. Payment Terms" },
              { href: "#termination", label: "9. Termination" },
              { href: "#liability", label: "10. Limitation of Liability" },
              { href: "#governing-law", label: "11. Governing Law" },
              { href: "#dispute-resolution", label: "12. Dispute Resolution" },
              { href: "#changes", label: "13. Changes to Terms" },
              { href: "#contact", label: "14. Contact Information" },
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

      {/* 1. Acceptance of Terms */}
      <Section
        id="acceptance"
        icon={FileText}
        title="1. Acceptance of Terms"
      >
        <p>
          By accessing or using Markinga UG (&quot;the Service&quot;), you agree
          to be bound by these Terms of Service (&quot;Terms&quot;). If you do
          not agree to these Terms, you may not access or use the Service.
        </p>
        <p className="mt-3">
          These Terms constitute a legally binding agreement between you and
          Markinga UG. Please read them carefully before using the platform. Your
          continued use of the Service following the posting of any changes to
          these Terms constitutes acceptance of those changes.
        </p>
        <p className="mt-3">
          If you are using the Service on behalf of a school, institution, or
          other organisation, you represent and warrant that you have the
          authority to bind that organisation to these Terms.
        </p>
      </Section>

      {/* 2. Description of Service */}
      <Section
        id="description"
        icon={Brain}
        title="2. Description of Service"
      >
        <p>
          Markinga UG is an AI-powered exam grading platform designed for
          Uganda&apos;s education system. The Service enables teachers and
          educational institutions to:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            Upload student examination papers in various formats (scanned
            images, photographs, PDFs)
          </li>
          <li>
            Process papers through Optical Character Recognition (OCR) to
            extract written content
          </li>
          <li>
            Grade papers using a multi-model AI approach, leveraging three
            independent AI systems (OpenAI, Anthropic, and Google) for improved
            reliability
          </li>
          <li>
            Review AI-generated grades and feedback before finalising results
          </li>
          <li>Export grading results for record-keeping and reporting</li>
        </ul>
        <p className="mt-3">
          The Service is designed to support the Ugandan curriculum, including
          Universal Primary Education (UPE), Universal Secondary Education
          (USE), Uganda Certificate of Education (O-Level), Uganda Advanced
          Certificate of Education (A-Level), and university-level assessments.
        </p>
      </Section>

      {/* 3. Account Registration */}
      <Section
        id="registration"
        icon={UserCheck}
        title="3. Account Registration"
      >
        <p>
          To use Markinga UG, you must create an account through our
          authentication provider, Clerk. By registering, you agree to:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            Provide accurate, current, and complete information during
            registration
          </li>
          <li>Maintain and update your information to keep it accurate</li>
          <li>
            Keep your login credentials secure and not share them with others
          </li>
          <li>
            Accept responsibility for all activity that occurs under your
            account
          </li>
          <li>
            Notify us immediately of any unauthorised use of your account
          </li>
        </ul>
        <p className="mt-3">
          You must be at least 18 years of age or have the consent of a parent
          or guardian to create an account. Teachers and school administrators
          are the intended primary users of the platform.
        </p>
      </Section>

      {/* 4. Acceptable Use */}
      <Section
        id="acceptable-use"
        icon={ShieldCheck}
        title="4. Acceptable Use"
      >
        <p>
          Markinga UG is provided for legitimate educational purposes. You agree
          to use the Service only for grading and assessment activities. The
          following activities are prohibited:
        </p>

        <h3 className="mb-2 mt-4 text-base font-semibold text-foreground">
          You Must Not
        </h3>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            Use the Service for any purpose other than educational assessment
            and grading
          </li>
          <li>
            Upload content that is illegal, harmful, threatening, abusive, or
            otherwise objectionable
          </li>
          <li>
            Attempt to reverse-engineer, decompile, or extract source code from
            the platform
          </li>
          <li>
            Use automated scripts, bots, or scrapers to access the Service
          </li>
          <li>
            Interfere with or disrupt the Service, servers, or networks
            connected to the Service
          </li>
          <li>
            Impersonate any person or entity or misrepresent your affiliation
            with any person or entity
          </li>
          <li>
            Share, resell, or sublicense access to the Service without written
            permission
          </li>
          <li>
            Upload papers or content for which you do not have the right or
            authorisation to process
          </li>
        </ul>
      </Section>

      {/* 5. Intellectual Property */}
      <Section
        id="intellectual-property"
        icon={Scale}
        title="5. Intellectual Property"
      >
        <h3 className="mb-2 mt-0 text-base font-semibold text-foreground">
          Your Content
        </h3>
        <p>
          You retain all ownership rights to the exam papers, marking schemes,
          and other content you upload to Markinga UG. By uploading content, you
          grant us a limited, non-exclusive licence to process that content
          solely for the purpose of providing the grading service to you.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Our Platform
        </h3>
        <p>
          The Markinga UG platform, including its software, design, features,
          algorithms, user interface, and documentation, is owned by Markinga UG
          and is protected by intellectual property laws. You may not copy,
          modify, distribute, or create derivative works based on the platform
          without our explicit written consent.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          AI-Generated Content
        </h3>
        <p>
          Grades, feedback, and other outputs generated by our AI grading system
          are provided as tools to assist your professional judgment. You are
          free to use, modify, and incorporate these outputs into your
          educational assessments.
        </p>
      </Section>

      {/* 6. AI Grading Disclaimer */}
      <Section
        id="ai-disclaimer"
        icon={AlertTriangle}
        title="6. AI Grading Disclaimer"
      >
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-semibold">Important: AI-Assisted, Not AI-Decided</p>
          <p className="mt-2">
            Markinga UG provides AI-assisted grading as a tool to support
            teachers. It is not a replacement for professional educational
            judgment. Teachers must review all AI-generated grades before
            finalising results.
          </p>
        </div>

        <p className="mt-4">By using the Service, you acknowledge and agree that:</p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            AI-generated grades are suggestions and recommendations, not final
            determinations
          </li>
          <li>
            Teachers bear the professional responsibility to review, validate,
            and where necessary adjust all grades before they are recorded or
            communicated to students
          </li>
          <li>
            The AI system may not fully understand context, nuance, or creative
            responses that a qualified teacher would recognise
          </li>
          <li>
            Markinga UG is a grading assistance tool and should not be the sole
            basis for academic decisions that affect student progression,
            certification, or standing
          </li>
          <li>
            The final grading decision always rests with the teacher or
            authorised examiner
          </li>
        </ul>
      </Section>

      {/* 7. Accuracy and Limitations */}
      <Section
        id="accuracy"
        icon={AlertTriangle}
        title="7. Accuracy and Limitations"
      >
        <h3 className="mb-2 mt-0 text-base font-semibold text-foreground">
          Three-Model Averaging
        </h3>
        <p>
          Markinga UG uses a three-model averaging approach where each exam paper
          is independently graded by three AI models (OpenAI, Anthropic, and
          Google). The results are averaged to improve reliability and reduce
          individual model bias. While this approach significantly improves
          grading consistency, it does not guarantee perfect accuracy.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          OCR Limitations
        </h3>
        <p>
          The accuracy of AI grading depends in part on the quality of Optical
          Character Recognition (OCR) applied to handwritten or printed exam
          papers. Factors that may affect OCR accuracy include:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>Handwriting legibility and consistency</li>
          <li>Paper quality and scanning resolution</li>
          <li>Presence of drawings, diagrams, or mathematical notation</li>
          <li>Smudges, corrections, or overlapping text</li>
          <li>
            Language-specific characters or non-standard formatting
          </li>
        </ul>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          No Guarantee
        </h3>
        <p>
          We strive for the highest possible accuracy but cannot guarantee that
          AI-generated grades will be error-free. The Service is provided
          &quot;as is&quot; and &quot;as available.&quot; Teachers remain
          responsible for verifying the accuracy of all grading results.
        </p>
      </Section>

      {/* 8. Payment Terms */}
      <Section id="payment" icon={CreditCard} title="8. Payment Terms">
        <p>
          Markinga UG is currently available as a free beta service. During this
          beta period:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            All core features are available at no cost to registered users
          </li>
          <li>
            Usage limits may apply to ensure fair access for all users
          </li>
          <li>
            The Service is provided without any service level agreements (SLAs)
            during the beta period
          </li>
        </ul>
        <p className="mt-3">
          Future pricing and subscription plans will be announced before the beta
          period ends. Existing users will be given reasonable notice of any
          upcoming pricing changes. We are committed to maintaining affordable
          access for Ugandan educators and institutions.
        </p>
      </Section>

      {/* 9. Termination */}
      <Section id="termination" icon={FileText} title="9. Termination">
        <h3 className="mb-2 mt-0 text-base font-semibold text-foreground">
          By You
        </h3>
        <p>
          You may terminate your account at any time by contacting us. Upon
          termination, we will delete your account data and uploaded exam papers
          within a reasonable period, unless retention is required by law.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          By Us
        </h3>
        <p>
          We reserve the right to suspend or terminate your account if you
          violate these Terms, engage in prohibited activities, or if we
          reasonably believe your use of the Service poses a risk to other users
          or the platform. We will provide notice of termination where
          practicable.
        </p>

        <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
          Effect of Termination
        </h3>
        <p>
          Upon termination, your right to use the Service ceases immediately.
          Provisions of these Terms that by their nature should survive
          termination shall remain in effect, including intellectual property
          rights, disclaimers, and limitations of liability.
        </p>
      </Section>

      {/* 10. Limitation of Liability */}
      <Section
        id="liability"
        icon={Scale}
        title="10. Limitation of Liability"
      >
        <p>
          To the maximum extent permitted by the laws of the Republic of Uganda:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            Markinga UG shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages arising from your use of
            the Service
          </li>
          <li>
            Our total liability for any claims arising from or related to the
            Service shall not exceed the amount you have paid to us in the twelve
            months preceding the claim, or one hundred thousand Uganda Shillings
            (UGX 100,000), whichever is greater
          </li>
          <li>
            We are not liable for any academic outcomes, grading disputes, or
            consequences arising from reliance on AI-generated grades without
            proper teacher review
          </li>
          <li>
            We are not liable for service interruptions, data loss, or
            inaccuracies caused by factors outside our reasonable control
          </li>
        </ul>
      </Section>

      {/* 11. Governing Law */}
      <Section id="governing-law" icon={Gavel} title="11. Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of the Republic of Uganda, without regard to conflict of law
          principles. Any legal action or proceeding arising under these Terms
          shall be brought exclusively in the courts of the Republic of Uganda.
        </p>
        <p className="mt-3">
          You consent to the jurisdiction and venue of such courts and waive any
          objection to the convenience of the forum.
        </p>
      </Section>

      {/* 12. Dispute Resolution */}
      <Section
        id="dispute-resolution"
        icon={Scale}
        title="12. Dispute Resolution"
      >
        <p>
          In the event of any dispute arising from or relating to these Terms or
          the Service, the parties agree to first attempt resolution through good
          faith negotiation. The process shall be as follows:
        </p>
        <ol className="my-2 list-decimal space-y-1 pl-5">
          <li>
            <strong>Informal Resolution:</strong> Contact us with a written
            description of the dispute. We will endeavour to resolve the matter
            within 30 days through direct communication.
          </li>
          <li>
            <strong>Mediation:</strong> If informal resolution fails, the
            parties may agree to submit the dispute to mediation under the rules
            of the Centre for Arbitration and Dispute Resolution (CADER) in
            Kampala, Uganda.
          </li>
          <li>
            <strong>Litigation:</strong> If mediation is unsuccessful or
            declined, either party may pursue the matter in the courts of the
            Republic of Uganda.
          </li>
        </ol>
      </Section>

      {/* 13. Changes to Terms */}
      <Section id="changes" icon={FileText} title="13. Changes to Terms">
        <p>
          We reserve the right to modify these Terms at any time. When we make
          changes:
        </p>
        <ul className="my-2 list-disc space-y-1 pl-5">
          <li>
            The &quot;Last updated&quot; date at the top of this page will be
            revised
          </li>
          <li>
            Material changes will be communicated through the platform or via
            email to registered users
          </li>
          <li>
            Continued use of the Service after changes are posted constitutes
            acceptance of the updated Terms
          </li>
          <li>
            If you disagree with the updated Terms, your sole remedy is to
            discontinue use of the Service and close your account
          </li>
        </ul>
      </Section>

      {/* 14. Contact Information */}
      <Section id="contact" icon={Mail} title="14. Contact Information">
        <p>
          For questions, concerns, or notices regarding these Terms of Service,
          please contact us:
        </p>
        <div className="mt-4 rounded-lg bg-muted p-4">
          <p className="font-semibold text-foreground">Markinga UG</p>
          <p className="mt-1">Republic of Uganda</p>
          <p className="mt-1">
            Email:{" "}
            <a
              href="mailto:legal@markinga.ug"
              className="text-primary hover:underline"
            >
              legal@markinga.ug
            </a>
          </p>
        </div>
        <p className="mt-4">
          For privacy-related inquiries, please refer to our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>
    </div>
  );
}
