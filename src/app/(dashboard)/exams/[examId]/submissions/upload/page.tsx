import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadSubmissionsClient } from "@/components/submissions/upload-submissions-client";

type PageProps = { params: Promise<{ examId: string }> };

export default async function UploadSubmissionsPage({ params }: PageProps) {
  const { examId } = await params;

  const { userId } = await auth();

  if (!userId) redirect("/login");

  const exam = await prisma.exam.findFirst({
    where: { id: examId, userId },
    select: { id: true, title: true, subject: true, level: true },
  });

  if (!exam) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/exams/${examId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Submissions</h1>
          <p className="text-muted-foreground">
            {exam.title} &bull; {exam.subject} &bull; {exam.level}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Answer Sheets</CardTitle>
          <CardDescription>
            Upload student answer sheets as PDF or image files. Each file will be
            processed with OCR to extract the text.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadSubmissionsClient examId={examId} />
        </CardContent>
      </Card>
    </div>
  );
}
