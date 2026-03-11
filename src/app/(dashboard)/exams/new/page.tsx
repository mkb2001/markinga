import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ExamForm } from "@/components/exams/exam-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function NewExamPage() {
  const { userId } = await auth();

  if (!userId) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Create New Exam</h1>
        <p className="text-muted-foreground">
          Set up a new exam to start collecting and marking student submissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
          <CardDescription>
            Fill in the details for your new exam. You can add questions after
            creating the exam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExamForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
